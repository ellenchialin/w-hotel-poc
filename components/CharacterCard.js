import React from 'react'
import { Box, AspectRatio, Image } from '@chakra-ui/react'
import { useCharacterContext } from '../contexts/CharacterContext'

function CharacterCard({ character }) {
  const { name, image } = character
  // const imageCID = image.slice(7)

  const { characterState, changeCharacter } = useCharacterContext()
  const bgColor = characterState.character === name ? 'gray.500' : 'gray.300'

  const handleSelect = () => {
    changeCharacter(name)
  }

  return (
    <Box
      w='100px'
      h='100px'
      backgroundColor={bgColor}
      cursor='pointer'
      _hover={{ backgroundColor: 'gray.500' }}
      onClick={handleSelect}
    >
      {name}
    </Box>
  )
}

export default CharacterCard
