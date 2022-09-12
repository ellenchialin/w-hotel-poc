import { useContext, createContext, useState, useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const WalletContext = createContext()

export const WalletWrapper = ({ children }) => {
  // const [web3Modal, setWeb3Modal] = useState({})
  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState(address)
  const [chainId, setChainId] = useState()
  const web3ModalRef = useRef()

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const instance = await web3Modal.current.connect()
      const web3Provider = new ethers.providers.Web3Provider(instance)
      const accounts = await web3Provider.listAccounts()
      const { chainId } = await web3Provider.getNetwork()

      if (chainId !== 4) {
        alert('Please change network to Rinkeby')
        throw new Error('Please change network to Rinkeby')
      }

      if (accounts) setAccount(accounts[0])
      setChainId(chainId)
      setWalletConnected(true)

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
    } catch (error) {
      console.error(error)
    }
  }

  // useEffect(() => {
  //   if (!walletConnected) {
  //     const web3modal = new Web3Modal({
  //       network: 'rinkeby',
  //       cacheProvider: true, // optional
  //       providerOptions: {}
  //     })
  //     setWeb3Modal(web3modal)
  //     console.log('setting web3modal')
  //   }
  // }, [walletConnected])

  return (
    <WalletContext.Provider
      value={{
        account,
        getProviderOrSigner,
        connectWallet,
        walletConnected,
        setWalletConnected
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWalletContext() {
  return useContext(WalletContext)
}
