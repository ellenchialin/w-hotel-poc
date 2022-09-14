import { useState } from 'react'
import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useAccount, useContractReads, useContract, useProvider } from 'wagmi'

import {
  CHARACTER_CONTRACT_ADDRESS,
  CHARACTER_ABI
} from '../contracts/character'
import { EQUIPS_CONTRACT_ADDRESS, EQUIPS_ABI } from '../contracts/equips'
import Characters from './Characters'
import EquipCard from './EquipCard'
import { loopToGetJSONs } from '../utils/helpers'

const EQUIP_TOKEN_IDS = [0, 1, 2, 3]

const equipsTokenURICalls = EQUIP_TOKEN_IDS.map((id) => ({
  addressOrName: EQUIPS_CONTRACT_ADDRESS,
  contractInterface: EQUIPS_ABI,
  functionName: 'uri',
  args: [id]
}))

function AssetsSection() {
  const [ownedCharacters, setOwnedCharacters] = useState([])
  const [ownedEquips, setOwnedEquips] = useState({
    shoes: [],
    hats: []
  })
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const provider = useProvider()

  const characterContract = useContract({
    addressOrName: CHARACTER_CONTRACT_ADDRESS,
    contractInterface: CHARACTER_ABI,
    signerOrProvider: provider
  })

  const equipsContract = useContract({
    addressOrName: EQUIPS_CONTRACT_ADDRESS,
    contractInterface: EQUIPS_ABI,
    signerOrProvider: provider
  })

  const { data: equipsTokenURIs } = useContractReads({
    contracts: equipsTokenURICalls,
    cacheOnBlock: true,
    onSuccess(equipsTokenURIs) {
      setIsLoading(true)
      const allShoesURIs = equipsTokenURIs.slice(0, 2)
      const allHatsURIs = equipsTokenURIs.slice(2, 4)

      // fetch assets
      fetchOwnedCharacters(address)
      fetchOwnedEquips(address, allShoesURIs, allHatsURIs)
    }
  })

  const fetchOwnedCharacters = async (accountAddress) => {
    try {
      // Get assets
      const assets = await characterContract.balanceOf(accountAddress)

      // Get token URIs
      const tokenURIs = []
      for (let i = 0; i < assets.toNumber(); i++) {
        const tokenId = await characterContract.tokenOfOwnerByIndex(
          accountAddress,
          i
        )
        const tokenURI = await characterContract.tokenURI(tokenId.toNumber())
        tokenURIs.push(tokenURI.slice(7))
      }

      // Read data from ipfs
      const characterJSONs = await loopToGetJSONs(tokenURIs)
      setOwnedCharacters(characterJSONs)
    } catch (error) {
      console.error('Error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOwnedEquips = async (accountAddress, allShoes, allHats) => {
    try {
      // Get owned assets
      const accountsArray = Array.from({ length: 4 }, () => accountAddress)
      const rawAssets = await equipsContract.balanceOfBatch(
        accountsArray,
        EQUIP_TOKEN_IDS
      )
      const numberOfAssets = rawAssets.map((asset) => asset.toNumber())
      const numberOfShoes = numberOfAssets.slice(0, 2)
      const numberOfHats = numberOfAssets.slice(2, 4)

      const ownedShoesURIs = numberOfShoes.map((num, index) => {
        if (num !== 0) {
          return allShoes[index]
        }
      })
      const ownedHatsURIs = numberOfHats.map((num, index) => {
        if (num !== 0) {
          return allHats[index]
        }
      })
      const ownedShoesCIDs = ownedShoesURIs.map((uri) => uri.slice(7))
      const ownedHatsCIDs = ownedHatsURIs.map((uri) => uri.slice(7))

      // Read shoes data from ipfs
      const shoesJSONs = await loopToGetJSONs(ownedShoesCIDs)
      const hatsJSONs = await loopToGetJSONs(ownedHatsCIDs)

      setOwnedEquips({
        shoes: shoesJSONs,
        hats: hatsJSONs
      })
    } catch (error) {
      console.error('Error', error)
    }
  }

  // console.log('characterState: ', characterState)

  return (
    <Flex
      w='full'
      maxW='500px'
      h='500px'
      p={8}
      backgroundColor='gray.100'
      borderRadius='md'
    >
      <Tabs>
        <TabList>
          <Tab>Charaters</Tab>
          <Tab>Shoes</Tab>
          <Tab>Head</Tab>
        </TabList>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TabPanels>
            <TabPanel>
              <Characters ownedCharacters={ownedCharacters} />
            </TabPanel>
            <TabPanel>
              {ownedEquips.shoes.map((shoe) => (
                <EquipCard key={shoe.name} equip={shoe} equipType='shoe'>
                  {shoe.name}
                </EquipCard>
              ))}
            </TabPanel>
            <TabPanel>
              {ownedEquips.hats.map((hat) => (
                <EquipCard key={hat.name} equip={hat} equipType='hat'>
                  {hat.name}
                </EquipCard>
              ))}
            </TabPanel>
          </TabPanels>
        )}
      </Tabs>
    </Flex>
  )
}

export default AssetsSection
