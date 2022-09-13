import { useState, useEffect, useRef } from 'react'
import { useAccount, useContractRead, useContract } from 'wagmi'
import { Flex } from '@chakra-ui/react'

import CharacterCard from './CharacterCard'

function Characters({ ownedCharacters }) {
  return (
    <div>
      <Flex gap={2} wrap='wrap'>
        {ownedCharacters.map((ca) => (
          <CharacterCard key={ca.name} character={ca} />
        ))}
      </Flex>
    </div>
  )
}

export default Characters
