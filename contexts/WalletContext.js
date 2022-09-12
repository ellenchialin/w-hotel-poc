import { useContext, createContext, useState, useEffect, useRef } from 'react'
import { providers } from 'ethers'
import Web3Modal from 'web3modal'

const WalletContext = createContext()

export const WalletWrapper = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState()
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

      console.log('accounts: ', accounts)

      if (needSigner) {
        const signer = web3Provider.getSigner()
        return signer
      }
      return web3Provider
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      })
    }
  }, [walletConnected])

  return (
    <WalletContext.Provider
      value={{
        account,
        getProviderOrSigner,
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
