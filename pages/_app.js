import { ChakraProvider } from '@chakra-ui/react'
import { WagmiConfig, createClient, configureChains, chain } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'

import { WalletWrapper } from '../contexts/WalletContext'

const { chains, provider } = configureChains(
  [chain.rinkeby],
  [
    publicProvider({ priority: 1 }),
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_KEY
    })
  ]
)
const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider
})

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
