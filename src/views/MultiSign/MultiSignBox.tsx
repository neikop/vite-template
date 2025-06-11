import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Input,
  Link,
  Show,
  SimpleGrid,
  Span,
  Stack,
  Text,
  useCheckbox,
} from "@chakra-ui/react"
import { AbiCoder as AbiCoderV6 } from "@ethersproject/abi-v6"
import { useMutation } from "@tanstack/react-query"
import { BalanceDisplay, ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { toaster } from "components/ui/toaster"
import { queryClient } from "config/queryClient"
import { ERC20Abi, ISCAbi } from "contracts/abis"
import { MdArrowDownward, MdClearAll } from "react-icons/md"
import { RxOpenInNewWindow } from "react-icons/rx"
import { useMultiSignStore } from "store/multiSignStore"
import { shortenAddress } from "utils/common"
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  encodePacked,
  http,
  keccak256,
  pad,
  parseEther,
  size,
  stringToHex,
  toBytes,
  toHex,
  zeroAddress,
} from "viem"
import { getRelayer } from "views/Transfer/utils"
import { useAccount, useWalletClient } from "wagmi"

const vaultAddress: Address = "0xa80258Eea4BA0865610eb239045737D08929c40b"

const MultiSignBox = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { setSignatures, signatures } = useMultiSignStore()
  const { clear, setFromChain, setInputAmount, setReceiveAddress, setToken } = useMultiSignStore()
  const { fromChain, inputAmount, receiveAddress, token } = useMultiSignStore()

  const isSigning = useCheckbox({ defaultChecked: false })

  const handleSign = async (index: number) => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !fromChain || !receiveAddress) {
      throw Error("Missing information, please complete the empty fields")
    }

    const iscAddress = token.intent?.isc as Address
    const handlerAddress = token.intent?.handler as Address

    const amount = parseEther(inputAmount)
    const recipientAddress = receiveAddress as Address
    const tokenAddress = token.address

    const publicClient = createPublicClient({
      chain: fromChain,
      transport: http(),
    })

    const nonce = await publicClient.readContract({
      abi: ISCAbi,
      address: iscAddress,
      args: [vaultAddress],
      functionName: "getNonce",
    })

    // Create the agreement
    const agreement = {
      nonce,
      resolverData: [
        pad(recipientAddress, { size: 32 }),
        pad(vaultAddress, { size: 32 }),
        pad(tokenAddress, { size: 32 }),
      ],
      sections: [
        {
          app: tokenAddress,
          handler: handlerAddress,
          intents: [
            {
              key: [stringToHex("fungible: balance", { size: 32 })],
              opcode: stringToHex("-", { size: 32 }),
              owner: vaultAddress,
              signer: vaultAddress,
              value: pad(toHex(amount), { size: 32 }),
            },
            {
              key: [stringToHex("fungible: balance", { size: 32 })],
              opcode: stringToHex("+", { size: 32 }),
              owner: recipientAddress,
              signer: zeroAddress,
              value: pad(toHex(amount), { size: 32 }),
            },
          ],
        },
      ],
      signatures: [] as Address[],
    }

    const formattedAgreement = await publicClient.readContract({
      abi: ISCAbi,
      address: iscAddress,
      args: [agreement, true],
      functionName: "format",
    })

    const signature = await walletClient.request({
      method: "personal_sign",
      params: [formattedAgreement as Address, address],
    })

    const signedIndex = signatures.findIndex((item) => item.address === address)
    if (signedIndex > -1) {
      signatures[signedIndex] = {}
    }
    signatures[index] = { address, signature }
    setSignatures(signatures)
  }

  const handleWithdraw = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !fromChain || !receiveAddress) {
      throw Error("Missing information, please complete the empty fields")
    }

    const iscAddress = token.intent?.isc as Address
    const handlerAddress = token.intent?.handler as Address

    const amount = parseEther(inputAmount)
    const recipientAddress = receiveAddress as Address
    const tokenAddress = token.address

    const publicClient = createPublicClient({
      chain: fromChain,
      transport: http(),
    })

    const nonce = await publicClient.readContract({
      abi: ISCAbi,
      address: iscAddress,
      args: [address],
      functionName: "getNonce",
    })

    const signature = (vaultAddress + signatures[0].signature?.slice(2) + signatures[1].signature?.slice(2)) as Address
    console.log({ signature })

    // Create the agreement
    const agreement = {
      nonce,
      resolverData: [
        pad(recipientAddress, { size: 32 }),
        pad(vaultAddress, { size: 32 }),
        pad(tokenAddress, { size: 32 }),
      ],
      sections: [
        {
          app: tokenAddress,
          handler: handlerAddress,
          intents: [
            {
              key: [stringToHex("fungible: balance", { size: 32 })],
              opcode: stringToHex("-", { size: 32 }),
              owner: vaultAddress,
              signer: vaultAddress,
              value: pad(toHex(amount), { size: 32 }),
            },
            {
              key: [stringToHex("fungible: balance", { size: 32 })],
              opcode: stringToHex("+", { size: 32 }),
              owner: recipientAddress,
              signer: zeroAddress,
              value: pad(toHex(amount), { size: 32 }),
            },
          ],
        },
      ],
      signatures: [signature],
    }

    const agreementData = new AbiCoderV6().encode(
      [
        "tuple(uint256 nonce, tuple(address handler, address app, tuple(address owner, bytes32[] key, bytes32 opcode, bytes32 value, address signer)[] intents)[] sections, bytes[] signatures, bytes32[] resolverData)",
      ],
      [
        [
          agreement.nonce,
          agreement.sections.map((section) => [
            section.handler,
            section.app,
            section.intents.map((intent) => [intent.owner, intent.key, intent.opcode, intent.value, intent.signer]),
          ]),
          agreement.signatures,
          agreement.resolverData,
        ],
      ],
    ) as Address

    const encodedFuncData = encodeFunctionData({
      abi: ERC20Abi,
      args: [vaultAddress, recipientAddress, amount],
      functionName: "transferFrom",
    })

    const data = encodePacked(
      ["bytes", "bytes", "uint256", "bytes32"],
      [encodedFuncData, agreementData, BigInt(size(agreementData)), keccak256(toBytes("intent.calldata.suffix"))],
    )

    const { relayerAccount, relayerAddress } = getRelayer()

    const relayerClient = createWalletClient({
      account: relayerAccount,
      chain: fromChain,
      transport: http(),
    })

    const txHash = await relayerClient.sendTransaction({
      data,
      from: relayerAddress,
      to: tokenAddress,
    })

    return txHash
  }

  const transferMutation = useMutation({
    mutationFn: handleWithdraw,
    onError: (error) => {
      toaster.create({
        description: error.message || "There was an error sending your transaction",
        title: error.name || "Failed",
        type: "error",
      })
    },
    onSuccess: () => {
      toaster.create({
        description: "Your transaction was successfully sent",
        title: "Success",
        type: "success",
      })
      queryClient.invalidateQueries({ queryKey: ["fetchBalance"] })
    },
  })

  const handleRemoveSignature = (index: number) => {
    signatures[index] = {}
    setSignatures(signatures)
  }

  const handleClear = () => {
    clear()
    setInputAmount("")
  }

  return (
    <Stack gap={6}>
      <Stack borderRadius={16} borderWidth={1} maxW={420} p={4}>
        <Show when={!isSigning.checked}>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Text fontWeight="bold">Withdraw</Text>
              <ChainSelectPopover
                buttonProps={{
                  colorPalette: "gray",
                  opacity: 1,
                  variant: "outline",
                }}
                isDevnet={true}
                onChange={(chain) => {
                  setFromChain(chain)
                  if (fromChain?.id !== chain?.id) {
                    setToken(null)
                  }
                }}
                value={fromChain}
              />
            </Flex>

            <Button h={8} minW={8} onClick={handleClear} p={1} variant="ghost">
              <MdClearAll />
            </Button>
          </Flex>

          <Stack gap={4} position="relative">
            <Stack backgroundColor="bg.muted" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  Amount
                </Text>
                <BalanceDisplay chain={fromChain} onMax={(balance) => setInputAmount(balance)} token={token} />
              </Flex>
              <Flex gap={2} justifyContent="space-between">
                <NumericInput
                  border="none"
                  fontSize="2xl"
                  fontWeight="semibold"
                  h={8}
                  onChange={(event) => setInputAmount(event.target.value)}
                  p={0}
                  placeholder="0.0"
                  value={inputAmount}
                />

                <TokenSelectDialog
                  buttonProps={{ colorPalette: "purple", variant: "surface" }}
                  fromChain={fromChain}
                  isDevnet={true}
                  onChange={setToken}
                  value={token}
                />
              </Flex>
            </Stack>

            <Flex justifyContent="center" position="absolute" top="50%" transform="translateY(-50%)" w="full">
              <Center backgroundColor="bg.panel" borderRadius={6} p={1}>
                <Button colorPalette="gray" size="xs" variant="subtle">
                  <MdArrowDownward />
                </Button>
              </Center>
            </Flex>

            <Stack backgroundColor="bg.muted" borderRadius={16} gap={4} p={4}>
              <Flex justifyContent="space-between">
                <Text fontSize="sm" fontWeight="semibold">
                  Receiver
                </Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Input
                  border="none"
                  fontSize="lg"
                  fontWeight="semibold"
                  h={8}
                  onChange={(event) => setReceiveAddress(event.target.value)}
                  p={0}
                  placeholder="0x..."
                  value={receiveAddress}
                />
              </Flex>
            </Stack>
          </Stack>

          <Stack pt={9}>
            <Button
              borderRadius={16}
              colorPalette="purple"
              disabled={!isConnected || !inputAmount || !receiveAddress}
              onClick={() => isSigning.setChecked(true)}
              size="xl"
              variant="subtle"
            >
              Withdraw
            </Button>
          </Stack>
        </Show>

        <Show when={isSigning.checked}>
          <Stack>
            <Flex>
              <Text>
                Withdraw: {inputAmount} {token?.symbol}
              </Text>
            </Flex>
            <Box>
              <Text>To: {shortenAddress(receiveAddress)}</Text>
              <Flex h={0} overflow="hidden">
                <Input />
                <Input />
              </Flex>
            </Box>
          </Stack>
          {signatures.map((item, index) => {
            return (
              <Stack borderRadius={16} borderWidth={1} fontSize="sm" gap={4} key={index} p={4}>
                <Text fontWeight="bold" textAlign="center">
                  Signature [{index + 1}]
                </Text>

                <Stack>
                  <Text fontWeight="semibold">
                    Address:{" "}
                    <Span fontFamily="mono" fontWeight="normal">
                      {shortenAddress(item.address)}
                    </Span>
                  </Text>
                  <Text fontWeight="semibold">
                    Signature:{" "}
                    <Span fontFamily="mono" fontWeight="normal">
                      {shortenAddress(item.signature)}
                    </Span>
                  </Text>
                </Stack>

                <ButtonGroup justifyContent="center" size="sm" variant="subtle">
                  <Button onClick={() => handleRemoveSignature(index)} rounded="full" w={120}>
                    Clear
                  </Button>
                  <Button colorPalette="purple" onClick={() => handleSign(index)} rounded="full" w={120}>
                    Sign
                  </Button>
                </ButtonGroup>
              </Stack>
            )
          })}

          <Button
            borderRadius={16}
            colorPalette="purple"
            disabled={!signatures[0].signature || !signatures[1].signature}
            loading={transferMutation.isPending}
            onClick={() => transferMutation.mutateAsync()}
            size="lg"
            variant="subtle"
          >
            Submit
          </Button>
        </Show>
      </Stack>

      {transferMutation.isSuccess && (
        <Stack borderRadius={16} borderWidth={1} fontSize="sm" maxW={420} p={4}>
          <Text color="primary.main" fontWeight="semibold">
            Transaction Receipt:
          </Text>

          <SimpleGrid gap={2} templateColumns="80px 1fr">
            <Text>Tx Hash: </Text>
            <Link
              fontFamily="mono"
              href={`${fromChain?.blockExplorers?.default.url}/tx/${transferMutation.data}`}
              target="_blank"
              w="fit-content"
            >
              {shortenAddress(transferMutation.data)}
              <RxOpenInNewWindow />
            </Link>
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  )
}

export default MultiSignBox
