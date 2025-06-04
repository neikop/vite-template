import { Box, Button, CloseButton, Dialog, Flex, Image, Input, Portal, Stack, Text, useDialog } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react"
import { MdExpandMore } from "react-icons/md"
import { ipfsService } from "services"

type Props = {
  onChange?: (chain: null | Token) => void
  value?: null | Token
}

const TokenSelectDialog = ({ onChange, value }: Props) => {
  const dialog = useDialog()

  const [searchText, setSearchText] = useState("")
  const [currentToken, setCurrentToken] = useState<null | Token>(null)

  const selectedToken = value !== undefined ? value : currentToken

  const { data: tokens } = useQuery({
    queryFn: () => ipfsService.fetchTokens(),
    queryKey: ["ipfsService.fetchTokens"],
  })

  const filteredTokens = useMemo(() => {
    return (tokens ?? []).filter((token) => {
      return [token.name, token.symbol, token.address].some((item) =>
        item.toLowerCase().includes(searchText.toLowerCase()),
      )
    })
  }, [tokens, searchText])

  return (
    <Dialog.RootProvider placement="top" scrollBehavior="inside" size="sm" value={dialog}>
      <Dialog.Trigger asChild>
        <Button px={selectedToken ? 1 : undefined} rounded="full" size="xs" variant="outline">
          {selectedToken ? (
            <>
              <Image h={6} rounded="full" src={selectedToken.logoURI} w={6} />
              {selectedToken.symbol}
            </>
          ) : (
            "Select Token"
          )}
          <MdExpandMore />
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content mt="142px">
            <Dialog.Header>
              <Dialog.Title>Select a Token</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body maxH={600} overflowY="scroll" pr={4} pt={0}>
              <Box backgroundColor="white" pb={2} position="sticky" top={0} zIndex={1}>
                <Input
                  colorPalette="purple"
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Search by token name, symbol or address"
                  rounded="full"
                  size="xl"
                  value={searchText}
                />
              </Box>
              <Stack gap={2}>
                {filteredTokens.map((token) => {
                  const isSelected = token.address === selectedToken?.address
                  return (
                    <Button
                      borderColor="transparent"
                      borderRadius={8}
                      colorPalette={isSelected ? "purple" : "gray"}
                      justifyContent="flex-start"
                      key={`${token.chainId}/${token.address}`}
                      onClick={() => {
                        setCurrentToken(token)
                        onChange?.(token)
                        dialog.setOpen(false)
                      }}
                      px={2}
                      size="lg"
                      variant={isSelected ? "surface" : "outline"}
                    >
                      <Image h={6} rounded="full" src={token.logoURI} w={6} />
                      <Box flex={1} textAlign="left">
                        <Text lineHeight="20px">{token.symbol}</Text>
                        <Flex flex={1} justifyContent="space-between">
                          <Text color="blackAlpha.800" fontSize="xs" fontWeight="normal" lineHeight="20px">
                            {token.name}
                          </Text>
                          <Text color="blackAlpha.800" fontSize="xs" fontWeight="normal" lineHeight="20px">
                            ChainID: {token.chainId}
                          </Text>
                        </Flex>
                      </Box>
                    </Button>
                  )
                })}
              </Stack>
            </Dialog.Body>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  )
}

export default TokenSelectDialog
