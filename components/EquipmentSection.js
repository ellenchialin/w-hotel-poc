import { useState, useEffect } from 'react'
import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  useAccount,
  useContractReads,
  useContractRead,
  useProvider
} from 'wagmi'

import Characters from './Characters'
import { EQUIPS_CONTRACT_ADDRESS, EQUIPS_ABI } from '../contracts/equips'

const equipsContract = {
  addressOrName: EQUIPS_CONTRACT_ADDRESS,
  contractInterface: EQUIPS_ABI,
  chainId: 4
}

function EquipmentSection() {
  const [allTokenData, setAllTokenData] = useState([])
  const { address } = useAccount()
  const provider = useProvider()

  const fetchCharacters = async () => {
    try {
      const NFTcontract = new Contract(
        RINKEBY_721_CONTRACT_ADDRESS,
        abi,
        provider
      )

      // Get assets
      const assets = await NFTcontract.balanceOf(account)
      setNumOfAssets(assets.toNumber())
      console.log('Number of assets: ', assets.toNumber())

      // Get token URIs
      let tokenURIs = []
      for (let i = 0; i < assets.toNumber(); i++) {
        const tokenId = await NFTcontract.tokenOfOwnerByIndex(account, i)
        const tokenURI = await NFTcontract.tokenURI(tokenId.toNumber())
        tokenURIs.push(tokenURI.slice(7))
      }
      console.log('Token URIs: ', tokenURIs)

      // Read data from ipfs
      for (let i = 0; i < tokenURIs.length; i++) {
        try {
          const response = await fetch(
            `https://gateway.pinata.cloud/ipfs/${tokenURIs[i]}`
          )

          console.log('Found token', i)

          const data = await response.json()
          setAllTokenData((prev) => [...prev, data])
        } catch (error) {
          console.error(`Token ${i} error`, error)
        }
      }
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  return (
    <Flex p={8} backgroundColor='gray.100' borderRadius='md'>
      <Tabs>
        <TabList>
          <Tab>Charaters</Tab>
          <Tab>Hats</Tab>
          <Tab>Shoes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Characters provider={provider} />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  )
}

export default EquipmentSection
