import { Flex } from '@chakra-ui/react'

import CharacterCard from './CharacterCard'

function Characters({ ownedCharacters }) {
  return (
    <div>
      <Flex gap={2} wrap='wrap'>
        {ownedCharacters.length > 0 ? (
          ownedCharacters.map((ca) => (
            <CharacterCard key={ca.name} character={ca} />
          ))
        ) : (
          <p>No character asset under this account</p>
        )}
      </Flex>
    </div>
  )
}

export default Characters
