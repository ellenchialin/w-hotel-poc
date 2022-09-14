import { Flex, Text, Box } from '@chakra-ui/react'

function EquipPreviewCard({ description, assetName, handleClick }) {
  return (
    <Flex w='150px' height='150px' direction='column'>
      <Box>{assetName !== '' ? assetName : 'None'}</Box>
      <Flex gap={4}>
        <Text fontWeight='bold'>{description}</Text>
        <Box cursor='pointer' onClick={handleClick}>
          <Text color='red.400'>
            {description === 'Character' ? 'Remove all' : 'Remove'}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default EquipPreviewCard
