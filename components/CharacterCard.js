import { AspectRatio, Image } from '@chakra-ui/react'
import { useCharacterContext } from '../contexts/CharacterContext'

function CharacterCard({ character }) {
  const { name, image } = character
  const imageCID = image.slice(7)

  const { characterState, changeCharacter } = useCharacterContext()
  const borderColor = characterState.character === name ? '2px solid black' : ''

  const handleSelect = () => {
    changeCharacter(name)
  }

  return (
    <AspectRatio
      width='120px'
      ratio={1}
      cursor='pointer'
      _hover={{ boxShadow: 'lg' }}
      border={borderColor}
      borderRadius='md'
      onClick={handleSelect}
    >
      <Image
        src={`https://minter.mypinata.cloud/ipfs/${imageCID}`}
        alt={name}
        borderRadius='sm'
      />
    </AspectRatio>
  )
}

export default CharacterCard
