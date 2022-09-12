import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import Web3Modal from 'web3modal'
import { providers, Contract } from 'ethers'

import styles from '../styles/Home.module.css'
import { RINKEBY_721_CONTRACT_ADDRESS, abi } from '../utils/contract'
import { truncateAddress } from '../utils/helpers'

const JSONdataUI = ({ data }) => {
  const { name, description, image, attributes } = data

  return (
    <div className={styles.card}>
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <p>Image: {image}</p>
      {attributes &&
        attributes.map((att) => (
          <code key={att.trait_type} style={{ whiteSpace: 'pre' }}>
            trait_type: {att.trait_type}, value: {att.value}
          </code>
        ))}
    </div>
  )
}

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [numOfAssets, setNumOfAssets] = useState()
  const [chainId, setChainId] = useState()
  const [allTokenData, setAllTokenData] = useState([])
  const [notFoundTokens, setNotFoundTokens] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const web3ModalRef = useRef()

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect()
      const web3Provider = await new providers.Web3Provider(provider)
      const accounts = await web3Provider.listAccounts()
      const { chainId } = await web3Provider.getNetwork()
      setChainId(chainId)

      if (chainId !== 4) {
        alert('Change network to Rinkeby')
        throw new Error('Change network to Rinkeby')
      }
      if (accounts) setAccount(accounts[0])

      if (needSigner) {
        const signer = web3Provider.getSigner()
        return signer
      }
      return web3Provider
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) {
      console.error(error)
    }
  }

  const getAssets = async () => {
    try {
      setIsLoading(true)
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
          const x = i // to remember i is the current number
          setNotFoundTokens((prev) => [...prev, x])
          console.error(`Token ${i} error`, error)
        }
      }
    } catch (error) {
      console.error('Error: ', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      return (
        <button onClick={getAssets} className={styles.button}>
          {isLoading ? 'Loading...' : 'Show assets'}
        </button>
      )
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect wallet
        </button>
      )
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      })
      connectWallet()
    }
  }, [walletConnected])

  return (
    <div className={styles.container}>
      <Head>
        <title>W-Hotel-POC</title>
        <meta name='description' content='w-hotel-poc' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        {renderButton()}
        <p>{`Account: ${truncateAddress(account)}`}</p>
        {numOfAssets && (
          <div className={styles.container_flex_column}>
            <p>{`Number of assets: ${
              numOfAssets > 0 ? numOfAssets : 'No assets'
            }`}</p>
            <div className={styles.card_group}>
              {allTokenData.length > 0 &&
                allTokenData.map((data) => (
                  <JSONdataUI key={data.name} data={data} />
                ))}
            </div>
          </div>
        )}
        {notFoundTokens.length > 0 && (
          <div>
            {notFoundTokens.map((tokenNumber) => (
              <p key={tokenNumber}>Token {tokenNumber} not found</p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
