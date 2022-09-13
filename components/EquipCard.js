import { AspectRatio, Image } from '@chakra-ui/react'
import { useCharacterContext } from '../contexts/CharacterContext'

function EquipCard({ equip, equipType }) {
  const { name, image } = equip
  const imageCID = image.slice(7)

  const { characterState, changeShoes, changeHat } = useCharacterContext()
  const borderColor =
    characterState.shoes === name || characterState.hat === name
      ? '2px solid black'
      : ''

  const handleSelect = () => {
    if (equipType === 'shoe') {
      changeShoes(name)
    } else {
      changeHat(name)
    }
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

export default EquipCard
