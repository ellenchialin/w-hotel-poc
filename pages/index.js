import Head from 'next/head'
import { Box, Flex } from '@chakra-ui/react'
import { useAccount } from 'wagmi'

import styles from '../styles/Home.module.css'
import Account from '../components/Account'
import { useIsMounted } from '../hooks/useIsMounted'
import EquipmentSection from '../components/EquipmentSection'
import RenderSection from '../components/RenderSection'

export default function Home() {
  const { isConnected } = useAccount()

  // need useIsMounted hook for wagmi to work on SSR
  const isMounted = useIsMounted()

  return (
    <div className={styles.container}>
      <Head>
        <title>W-Hotel-EquipmentPage-POC</title>
        <meta
          name='description'
          content='This is an Equipment Page POC for W Hotel project'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box p={8}>
        <Flex direction='column' align='center' gap={16}>
          {isMounted && (
            <>
              <Account />
              {isConnected && (
                <Flex gap={10}>
                  <RenderSection />
                  <EquipmentSection />
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Box>
    </div>
  )
}
