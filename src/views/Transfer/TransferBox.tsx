import { Button, Center, Checkbox, Flex, Input, Link, SimpleGrid, Stack, Text, useCheckbox } from "@chakra-ui/react"
import { AbiCoder as AbiCoderV6 } from "@ethersproject/abi-v6"
import { useMutation } from "@tanstack/react-query"
import { BalanceDisplay, ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { toaster } from "components/ui/toaster"
import { queryClient } from "config/queryClient"
import { ERC20Abi, ISCAbi } from "contracts/abis"
import { useState } from "react"
import { MdArrowDownward, MdClearAll } from "react-icons/md"
import { RxOpenInNewWindow } from "react-icons/rx"
import { useTransferStore } from "store/transferStore"
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
import { useAccount, useWalletClient } from "wagmi"

import { getRelayer } from "./utils"

const TransferBox = () => {
  const { address, chain, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { clear, setFromChain, setReceiveAddress, setToken } = useTransferStore()
  const { fromChain, receiveAddress, token } = useTransferStore()

  const [inputAmount, setInputAmount] = useState("")
  const usingIntent = useCheckbox({ defaultChecked: true })

  const selectedChain = usingIntent.checked ? fromChain : chain

  const handleTransferWithAggrement = async () => {
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

    return txHash
  }

  const handleTransferWithout = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !receiveAddress) return

    const amount = parseEther(inputAmount)

    const txHash = await walletClient.writeContract({
      abi: ERC20Abi,
      address: token.address,
      args: [receiveAddress, amount],
      functionName: "transfer",
    })

    return txHash
  }

  const transferMutation = useMutation({
    mutationFn: usingIntent.checked ? handleTransferWithAggrement : handleTransferWithout,
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

  const handleClear = () => {
    clear()
    setInputAmount("")
  }

  return (
    <Stack gap={6}>
      <Stack borderRadius={16} borderWidth={1} maxW={420} p={4}>
        <Flex justifyContent="space-between">
          <Flex alignItems="center" gap={2}>
            <Text fontWeight="bold">Transfer</Text>
            <ChainSelectPopover
              buttonProps={{
                colorPalette: "gray",
                opacity: 1,
                variant: "outline",
              }}
              isDevnet={usingIntent.checked}
              onChange={(chain) => {
                setFromChain(chain)
                if (fromChain?.id !== chain?.id) {
                  setToken(null)
                }
              }}
              shouldSync={!usingIntent.checked}
              value={selectedChain}
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
              <BalanceDisplay chain={selectedChain} onMax={(balance) => setInputAmount(balance)} token={token} />
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
                isDevnet={usingIntent.checked}
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
            <Checkbox.RootProvider colorPalette="purple" cursor="pointer" value={usingIntent} variant="outline">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
              <Checkbox.Label>Using Intent</Checkbox.Label>
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

      {transferMutation.isSuccess && (
        <Stack borderRadius={16} borderWidth={1} fontSize="sm" maxW={420} p={4}>
          <Text color="primary.main" fontWeight="semibold">
            Transaction Receipt:
          </Text>

          <SimpleGrid gap={2} templateColumns="80px 1fr">
            <Text>Tx Hash: </Text>
            <Link
              fontFamily="mono"
              href={`${selectedChain?.blockExplorers?.default.url}/tx/${transferMutation.data}`}
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

export default TransferBox
