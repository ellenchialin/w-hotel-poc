import React from 'react'
import { Box } from '@chakra-ui/react'

function CharacterCard({ character, isSelected, setSelectedCharacter }) {
  const { name, image } = character
  // const imageCID = image.slice(7)
  const bgColor = isSelected ? 'gray.500' : 'gray.300'

  const handleSelect = () => {
    setSelectedCharacter(name)
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
