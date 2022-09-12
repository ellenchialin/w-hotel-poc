import { Flex, Button } from '@chakra-ui/react'

import { useWalletContext } from '../contexts/WalletContext'
import { truncateAddress } from '../utils/helpers'

function Account() {
  const { walletConnected, setWalletConnected, getProviderOrSigner, account } =
    useWalletContext()

  const connectWallet = async () => {
    try {
      await getProviderOrSigner()
      setWalletConnected(true)
    } catch (error) {
      console.error(error)
    }
  }

  const connectButton = () => {
    if (walletConnected) {
      return <Button disabled>Connected</Button>
    } else {
      return <Button onClick={connectWallet}>Connect wallet</Button>
    }
  }
  console.log('account', account)

  return (
    <Flex align='center' gap={4}>
      {connectButton()}
      <p>{`Account: ${truncateAddress(account)}`}</p>
    </Flex>
  )
}

export default Account
