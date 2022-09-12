import { ChakraProvider } from '@chakra-ui/react'
import { WalletWrapper } from '../contexts/WalletContext'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <WalletWrapper>
        <Component {...pageProps} />
      </WalletWrapper>
    </ChakraProvider>
  )
}

export default MyApp
