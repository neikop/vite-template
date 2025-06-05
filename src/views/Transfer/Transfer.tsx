import { Button, Center, Checkbox, Container, Flex, Input, Stack, Text, useCheckbox } from "@chakra-ui/react"
import { AbiCoder as AbiCoderV6 } from "@ethersproject/abi-v6"
import { useMutation } from "@tanstack/react-query"
import { ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { ERC20Abi, ISCAbi } from "contracts/abis"
import { useState } from "react"
import { MdArrowDownward, MdClearAll } from "react-icons/md"
import { useTransferStore } from "store/transferStore"
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
import { useAccount, useWalletClient } from "wagmi"

import { getRelayer } from "./utils"

const Transfer = () => {
  const { address, chain, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { clear, setFromChain, setReceiveAddress, setToken } = useTransferStore()
  const { fromChain, receiveAddress, token } = useTransferStore()

  const [inputAmount, setInputAmount] = useState("")
  const withAggreement = useCheckbox({ defaultChecked: true })

  const handleTransferWithAggrement = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !fromChain || !receiveAddress) return

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

    // Create the agreement
    const agreement = {
      nonce,
      resolverData: [pad(recipientAddress, { size: 32 }), pad(address, { size: 32 }), pad(tokenAddress, { size: 32 })],
      sections: [
        {
          app: tokenAddress, // ERC20 intent or adapter
          handler: handlerAddress, // handler erc20 - 18 decimals
          intents: [
            {
              key: [stringToHex("fungible: balance", { size: 32 })],
              opcode: stringToHex("-", { size: 32 }),
              owner: address,
              signer: address,
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

    agreement.signatures[0] = signature

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
      args: [address, recipientAddress, amount],
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

    console.log(`${fromChain?.blockExplorers?.default.url}/tx/${txHash}`)

    return txHash
  }

  const handleTransferWithout = async () => {
    return ""
  }

  const transferMutation = useMutation({
    mutationFn: withAggreement.checked ? handleTransferWithAggrement : handleTransferWithout,
  })

  const handleClear = () => {
    clear()
    setInputAmount("")
  }

  return (
    <Container>
      <Stack alignItems="center">
        <Stack borderRadius={16} borderWidth={1} p={4} w={420}>
          <Flex justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Text fontWeight="bold">Transfer</Text>
              <ChainSelectPopover
                buttonProps={{ colorPalette: "gray", variant: "outline" }}
                onChange={setFromChain}
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
                <Flex gap={2}>
                  <Text fontSize="sm">Balance: 0</Text>
                  <Button colorPalette="purple" variant="text">
                    Max
                  </Button>
                </Flex>
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
                  isDevnet
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

          <Stack gap={4}>
            <Flex>
              <Checkbox.RootProvider colorPalette="purple" cursor="pointer" value={withAggreement} variant="outline">
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Transfer with agreement</Checkbox.Label>
              </Checkbox.RootProvider>
            </Flex>

            <Button
              borderRadius={16}
              colorPalette="purple"
              disabled={!isConnected}
              loading={transferMutation.isPending}
              onClick={() => transferMutation.mutateAsync()}
              size="xl"
              variant="subtle"
            >
              Transfer
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}

export default Transfer
