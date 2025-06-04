import {
  Box,
  Button,
  Center,
  CloseButton,
  Dialog,
  Flex,
  Image,
  Input,
  Portal,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  useDialog,
} from "@chakra-ui/react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDebounce } from "@uidotdev/usehooks"
import { InfiniteScroller } from "components/common"
import { useState } from "react"
import { MdExpandMore } from "react-icons/md"
import { kyberService } from "services"

type Props = {
  onChange?: (chain: null | Token) => void
  value?: null | Token
}

const TokenSelectDialog = ({ onChange, value }: Props) => {
  const dialog = useDialog()

  const [searchText, setSearchText] = useState("")
  const [currentToken, setCurrentToken] = useState<null | Token>(null)

  const debouncedSearchText = useDebounce(searchText, 300)

  const selectedToken = value !== undefined ? value : currentToken

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    getNextPageParam: (lastPage: TokensPagination, allPages) => {
      const maxPage = Math.ceil(lastPage.pagination.totalItems / 20)
      const nextPage = allPages.length + 1
      if (nextPage > maxPage) return undefined
      return nextPage
    },
    initialPageParam: 1,
    queryFn: ({ pageParam: page }) => kyberService.fetchTokens({ page, pageSize: 20, query: debouncedSearchText }),
    queryKey: ["kyberService.fetchTokens", { query: debouncedSearchText }],
  })

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
              <InfiniteScroller
                hasMore={!!hasNextPage}
                loadMore={() => {
                  if (!isFetching) fetchNextPage()
                }}
                useWindow={false}
              >
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
                <Stack gap={2} minH={240}>
                  {data?.pages
                    .flatMap((page) => page.tokens)
                    .map((token) => {
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
                          overflow="hidden"
                          px={2}
                          size="lg"
                          variant={isSelected ? "surface" : "outline"}
                        >
                          <Image h={6} rounded="full" src={token.logoURI} w={6} />
                          <Box flex={1} overflow="hidden" textAlign="left">
                            <Text lineHeight="20px">{token.symbol}</Text>
                            <Flex flex={1} gap={4} justifyContent="space-between">
                              <Text
                                color="blackAlpha.800"
                                fontSize="xs"
                                fontWeight="normal"
                                lineHeight="20px"
                                truncate={true}
                              >
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

                  {isFetching && (
                    <Flex alignItems="center" borderColor="transparent" borderWidth={1} gap={2} h={11} px={1}>
                      <SkeletonCircle size={8} />
                      <SkeletonText noOfLines={2} />
                    </Flex>
                  )}

                  {data?.pages[0]?.pagination.totalItems === 0 && (
                    <Center h={11}>
                      <Text color="blackAlpha.600">No results found.</Text>
                    </Center>
                  )}
                </Stack>
              </InfiniteScroller>
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
