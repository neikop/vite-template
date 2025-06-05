import { Button, Center, Container, HStack, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react"

const Guide = () => {
  const colors = ["gray", "purple"]
  const types = ["ghost", "subtle", "outline", "surface"]

  return (
    <Container>
      <Stack gap={6}>
        <Stack>
          <Text fontWeight="semibold">Button</Text>
          <SimpleGrid columns={types.length + 1} gap={2} w={600}>
            {colors.map((color) => (
              <>
                <Button colorPalette={color} textTransform="capitalize" variant="plain">
                  {color}
                </Button>
                {types.map((type) => (
                  <>
                    <Button
                      colorPalette={color}
                      key={`${color}/${type}`}
                      textTransform="capitalize"
                      variant={type as "solid"}
                    >
                      {type}
                    </Button>
                  </>
                ))}
              </>
            ))}
          </SimpleGrid>
        </Stack>

        <Stack>
          <Text fontWeight="semibold">Link</Text>
          <Link _hover={{ color: "blue.600" }} color="blue.500" href="https://google.com" target="_blank">
            https://google.com
          </Link>
        </Stack>

        <Stack>
          <Text fontWeight="semibold">Color</Text>
          <SimpleGrid columns={4} w="fit-content">
            <Text>Gray</Text>
            <Text color="gray.500" w={120}>
              Gray.500
            </Text>
            <Text color="gray.600" w={120}>
              Gray.600
            </Text>
            <Text color="gray.900" w={120}>
              Gray.900
            </Text>
            <Text>Purple</Text>
            <Text color="purple.500" w={120}>
              Purple.500
            </Text>
            <Text color="purple.600" w={120}>
              Purple.600
            </Text>
          </SimpleGrid>
        </Stack>

        <Stack>
          <Text fontWeight="semibold">Background</Text>
          <HStack>
            <Center backgroundColor="purple.50" p={2} w={200}>
              <Text>Purple.50</Text>
            </Center>
            <Center backgroundColor="bg.muted" p={2} w={200}>
              <Text>Bg.muted</Text>
            </Center>
          </HStack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Guide
