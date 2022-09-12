import { Flex, Button, Box, Text } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { rinkeby } from 'wagmi/chains'

import { truncateAddress } from '../utils/helpers'
import { useIsMounted } from '../hooks/useIsMounted'

function Account() {
  const isMounted = useIsMounted()
  const { connect } = useConnect({
    chainId: rinkeby.id,
    connector: new InjectedConnector()
  })
  const { connectors, error, isLoading, pendingConnector } = useConnect()
  const { address, connector, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isMounted && isConnected) {
    return (
      <Flex
        align='center'
        gap={10}
        p={4}
        backgroundColor='gray.300'
        borderRadius='md'
      >
        <Flex direction='column'>
          <Text fontWeight='bold'>{truncateAddress(address)}</Text>
          <Text>Connected to {connector?.name}</Text>
        </Flex>
        <Button onClick={disconnect}>Disconnect</Button>
      </Flex>
    )
  }

  return (
    <Box>
      {isMounted &&
        connectors.map((connector) => (
          <Button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={!connector.ready}
          >
            Connect with {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </Button>
        ))}

      {error && <Box>{error.message}</Box>}
    </Box>
  )
}

export default Account
