import { useState, useEffect, useRef } from 'react'
import { Flex, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  useAccount,
  useContractReads,
  useContractRead,
  useContract,
  useProvider
} from 'wagmi'

import {
  CHARACTER_CONTRACT_ADDRESS,
  CHARACTER_ABI
} from '../contracts/character'
import { EQUIPS_CONTRACT_ADDRESS, EQUIPS_ABI } from '../contracts/equips'
import { useCharacterContext } from '../contexts/CharacterContext'
import Characters from './Characters'

const equipsContract = {
  addressOrName: EQUIPS_CONTRACT_ADDRESS,
  contractInterface: EQUIPS_ABI,
  chainId: 4
}

function AssetsSection() {
  const effectRan = useRef(false)
  const { address } = useAccount()
  const provider = useProvider()
  const [ownedCharacters, setOwnedCharacters] = useState([])

  const { characterState } = useCharacterContext()

  const characterContract = useContract({
    addressOrName: CHARACTER_CONTRACT_ADDRESS,
    contractInterface: CHARACTER_ABI,
    signerOrProvider: provider
  })

  const fetchCharacters = async (accountAddress) => {
    try {
      // Get assets
      const assets = await characterContract.balanceOf(accountAddress)

      console.log('Number of assets: ', assets.toNumber())

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
      console.log('Token URIs: ', tokenURIs)

      // Read data from ipfs
      for (let i = 0; i < tokenURIs.length; i++) {
        try {
          const response = await fetch(
            `https://gateway.pinata.cloud/ipfs/${tokenURIs[i]}`
          )

          console.log('Found token', i)

          const data = await response.json()
          setOwnedCharacters((prev) => [...prev, data])
        } catch (error) {
          console.error(`Token ${i} error`, error)
        }
      }
    } catch (error) {
      console.error('Error: ', error)
    }
  }

  useEffect(() => {
    // for useEffect to run only once in dev mode
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      fetchCharacters(address)
    }

    return () => {
      console.log('unmounted')
      effectRan.current = true
    }
  }, [])

  console.log('characterState: ', characterState)

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
            <Characters ownedCharacters={ownedCharacters} />
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

export default AssetsSection
