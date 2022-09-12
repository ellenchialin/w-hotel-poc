import { useState, useEffect, useRef } from 'react'
import { useAccount, useContractRead, useContract } from 'wagmi'
import { Flex } from '@chakra-ui/react'

import CharacterCard from './CharacterCard'
import {
  CHARACTER_CONTRACT_ADDRESS,
  CHARACTER_ABI
} from '../contracts/character'

function Characters({ provider }) {
  const [ownedCharacters, setOwnedCharacters] = useState([])
  const [selectedCharacter, setSelectedCharacter] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const { address } = useAccount()
  const effectRan = useRef(false)

  const contract = useContract({
    addressOrName: CHARACTER_CONTRACT_ADDRESS,
    contractInterface: CHARACTER_ABI,
    signerOrProvider: provider
  })

  const fetchCharacters = async (accountAddress) => {
    try {
      setIsLoading(true)
      // Get assets
      const assets = await contract.balanceOf(accountAddress)

      console.log('Number of assets: ', assets.toNumber())

      // Get token URIs
      const tokenURIs = []
      for (let i = 0; i < assets.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(accountAddress, i)
        const tokenURI = await contract.tokenURI(tokenId.toNumber())
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // for useEffect to run only once
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      fetchCharacters(address)
    }

    return () => {
      console.log('unmounted')
      effectRan.current = true
    }
  }, [])

  return (
    <div>
      {isLoading ? (
        'Fetching data...'
      ) : (
        <Flex gap={2} wrap='wrap'>
          {ownedCharacters.map((ca) => (
            <CharacterCard
              key={ca.name}
              character={ca}
              isSelected={ca.name === selectedCharacter}
              setSelectedCharacter={setSelectedCharacter}
            />
          ))}
        </Flex>
      )}
    </div>
  )
}

export default Characters
