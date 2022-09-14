import { Flex, Button } from '@chakra-ui/react'

import EquipPreviewCard from './EquipPreviewCard'
import { useCharacterContext } from '../contexts/CharacterContext'

function RenderSection() {
  const { characterState, removeShoes, removeHat, removeAllEquips } =
    useCharacterContext()
  const { character, hat, shoes } = characterState

  return (
    <Flex
      w='full'
      maxW='500px'
      h='500px'
      direction='column'
      p={8}
      backgroundColor='gray.100'
      borderRadius='md'
    >
      <EquipPreviewCard
        description='Character'
        assetName={character}
        handleClick={() => removeAllEquips()}
      />
      <Flex gap={8}>
        <EquipPreviewCard
          description='Head'
          assetName={hat}
          handleClick={() => removeHat()}
        />
        <EquipPreviewCard
          description='Shoes'
          assetName={shoes}
          handleClick={() => removeShoes()}
        />
      </Flex>
    </Flex>
  )
}

export default RenderSection
