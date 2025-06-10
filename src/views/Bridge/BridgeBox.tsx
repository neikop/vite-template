import { Button, Center, Flex, Stack, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { toaster } from "components/ui/toaster"
import { ERC20Abi, OFTAbi } from "contracts/abis"
import * as ethers from "ethers"
import { useState } from "react"
import { MdClearAll, MdSwapVert } from "react-icons/md"
import { useBridgeStore } from "store/bridgeStore"
import { createPublicClient, http, parseEther } from "viem"
import { useAccount, useSwitchChain, useWalletClient } from "wagmi"

const BridgeBox = () => {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { switchChain } = useSwitchChain()

  const { clear, setInputChain, setOutputChain, setToken, swapChains } = useBridgeStore()
  const { inputChain, outputChain, token } = useBridgeStore()

  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount] = [inputAmount]

  const checkAllowance = async () => {
    if (!walletClient || !token || !inputChain) return

    const inputOFTAddress = token.bridges?.[inputChain.id] as Address
    const amount = parseEther(inputAmount)

    const publicClient = createPublicClient({
      chain: inputChain,
      transport: http(),
    })

    if (token.address !== inputOFTAddress) {
      const allowance = (await publicClient.readContract({
        abi: ERC20Abi,
        address: token.address,
        args: [address, inputOFTAddress],
        functionName: "allowance",
      })) as bigint

      if (allowance < amount) {
        await walletClient.writeContract({
          abi: ERC20Abi,
          account: address,
          address: token.address,
          args: [inputOFTAddress, amount],
          functionName: "approve",
        })

        const allowanceAfter = (await publicClient.readContract({
          abi: ERC20Abi,
          address: token.address,
          args: [address, inputOFTAddress],
          functionName: "allowance",
        })) as bigint

        if (allowanceAfter < amount) {
          return checkAllowance()
        }
      }
    }
  }

  const handleBridge = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !inputChain || !outputChain) return

    const inputOFTAddress = token.bridges?.[inputChain.id] as Address
    const outputOFTAddress = token.bridges?.[outputChain.id] as Address

    const publicClient = createPublicClient({
      chain: inputChain,
      transport: http(),
    })

    await checkAllowance()

    const amount = parseEther(inputAmount)
    const toAddress = address

    // bytes memory options = OptionsBuilder.newOptions().addExecutorLzReceiveOption(200000, 0);
    const options = "0x00030100110100000000000000000000000000030d40"

    const sendParam = [
      outputChain.id, // destination chain
      ethers.zeroPadValue(toAddress, 32), // to
      amount, // token amount to send
      (amount * 9_900n) / 10_000n, // mint token amount
      options,
      "0x",
      "0x",
    ]

    const quoteSend = await publicClient.readContract({
      abi: OFTAbi,
      address: inputOFTAddress,
      args: [sendParam, false],
      functionName: "quoteSend",
    })

    const fee = quoteSend as { lzTokenFee: bigint; nativeFee: bigint }

    const txHash = await walletClient.writeContract({
      abi: OFTAbi,
      account: address,
      address: inputOFTAddress,
      args: [sendParam, fee, address],
      functionName: "send",
      value: fee.nativeFee,
    })

    const result = await publicClient.waitForTransactionReceipt({ hash: txHash })

    const log = result.logs[result.logs.length - 1]
    const iface = new ethers.Interface(OFTAbi)
    const decodedOFTSent = iface.decodeEventLog("OFTSent", log.data, log.topics)

    console.log(`${inputChain?.blockExplorers?.default.url}/tx/${log.transactionHash}`)

    const outputClient = createPublicClient({
      chain: outputChain,
      transport: http(),
    })

    const unwatch = outputClient.watchContractEvent({
      abi: OFTAbi,
      address: outputOFTAddress,
      eventName: "OFTReceived",
      onLogs: (logs) => {
        const log = logs[0]
        const iface = new ethers.Interface(OFTAbi)
        const decodedOFTReceived = iface.decodeEventLog("OFTReceived", log.data, log.topics)

        if (decodedOFTSent.guid === decodedOFTReceived.guid) {
          console.log(`${outputChain?.blockExplorers?.default.url}/tx/${log.transactionHash}`)

          unwatch()
        }
      },
    })

    return txHash
  }

  const bridgeMutation = useMutation({
    mutationFn: handleBridge,
    onSuccess: () => {
      toaster.create({
        description: "Your transaction was successfully sent",
        title: "Success",
        type: "success",
      })
    },
  })

  const handleClear = () => {
    clear()
    setInputAmount("")
  }

  return (
    <Stack borderRadius={16} borderWidth={1} p={4} w={420}>
      <Flex justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Text fontWeight="bold">Bridge</Text>
          <TokenSelectDialog fromChain={inputChain} isDevnet onChange={setToken} value={token} />
        </Flex>

        <Button h={8} minW={8} onClick={handleClear} p={1} variant="ghost">
          <MdClearAll />
        </Button>
      </Flex>

      <Stack gap={4} position="relative">
        <Stack backgroundColor="bg.muted" borderRadius={16} gap={4} p={4}>
          <Flex justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              From
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

            <ChainSelectPopover
              onChange={(chain) => {
                setInputChain(chain)
                setToken(null)
              }}
              shouldSync
              testnet={true}
              value={inputChain}
            />
          </Flex>
        </Stack>

        <Flex justifyContent="center" position="absolute" top="50%" transform="translateY(-50%)" w="full">
          <Center backgroundColor="bg.panel" borderRadius={6} p={1}>
            <Button
              colorPalette="gray"
              onClick={() => {
                const { inputChain } = swapChains()
                if (inputChain) {
                  switchChain({ chainId: inputChain.id })
                }
                setToken(null)
              }}
              size="xs"
              variant="subtle"
            >
              <MdSwapVert />
            </Button>
          </Center>
        </Flex>

        <Stack backgroundColor="bg.muted" borderRadius={16} gap={4} p={4}>
          <Flex justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              To
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <NumericInput
              border="none"
              caretColor="transparent"
              color="textSecondary"
              fontSize="2xl"
              fontWeight="semibold"
              h={8}
              p={0}
              placeholder="0.0"
              readOnly={true}
              value={outputAmount}
            />

            <ChainSelectPopover onChange={setOutputChain} testnet={true} value={outputChain} />
          </Flex>
        </Stack>
      </Stack>

      <Stack pt={9}>
        <Button
          borderRadius={16}
          colorPalette="purple"
          disabled={!isConnected}
          loading={bridgeMutation.isPending}
          onClick={() => bridgeMutation.mutateAsync()}
          size="xl"
          variant="subtle"
        >
          Bridge
        </Button>
      </Stack>
    </Stack>
  )
}

export default BridgeBox
