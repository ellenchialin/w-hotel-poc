import { useState, useEffect } from 'react'
import { Contract } from 'ethers'

import { RINKEBY_721_CONTRACT_ADDRESS, abi } from '../utils/contract'

function EquipmentSection() {
  const [numOfAssets, setNumOfAssets] = useState()
  const [allTokenData, setAllTokenData] = useState([])

  const getAssets = async () => {
    try {
      const provider = await getProviderOrSigner()
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

  // useEffect(() => {
  //   getAssets()
  // }, [])

  return <div>EquipmentSection</div>
}

export default EquipmentSection
