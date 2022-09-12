import Head from 'next/head'
import { Box, Flex } from '@chakra-ui/react'

import styles from '../styles/Home.module.css'
import Account from '../components/Account'
import EquipmentSection from '../components/EquipmentSection'
import RenderSection from '../components/RenderSection'

export default function Home() {
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
          <Account />
          <Flex gap={10}>
            <RenderSection />
            <EquipmentSection />
          </Flex>
        </Flex>
      </Box>
    </div>
  )
}
