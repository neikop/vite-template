import { Button, Center, Flex, Link, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { BalanceDisplay, ChainSelectPopover, NumericInput, TokenSelectDialog } from "components/common"
import { toaster } from "components/ui/toaster"
import { queryClient } from "config/queryClient"
import { ERC20Abi, OFTAbi } from "contracts/abis"
import * as ethers from "ethers"
import { useState } from "react"
import { MdClearAll, MdSwapVert } from "react-icons/md"
import { RxOpenInNewWindow } from "react-icons/rx"
import { useBridgeStore } from "store/bridgeStore"
import { shortenAddress } from "utils/common"
import { createPublicClient, http, parseEther } from "viem"
import { useAccount, useSwitchChain, useWalletClient } from "wagmi"

import { encodeOptions } from "./utils"

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

    // @todo check
    if (token.chainId === 421614) {
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

  const [receiveTxHash, setReceiveTxHash] = useState("")
  const [loadingTxHash, setLoadingTxHash] = useState(false)

  const handleBridge = async () => {
    if (!address || !walletClient) return
    if (!inputAmount || !token || !inputChain || !outputChain) {
      throw Error("Missing information, please complete the empty fields")
    }

    setReceiveTxHash("")
    setLoadingTxHash(false)

    const inputOFTAddress = token.bridges?.[inputChain.id] as Address
    const outputOFTAddress = token.bridges?.[outputChain.id] as Address

    const publicClient = createPublicClient({
      chain: inputChain,
      transport: http(),
    })

    await checkAllowance()

    const amount = parseEther(inputAmount)
    const toAddress = address

    const options = encodeOptions(
      200000n, // gas
      0n, // value
      200000n, // native value
      address, // native receiver in dest chain
    )

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

    setLoadingTxHash(true)
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

          setReceiveTxHash(log.transactionHash!)
          setLoadingTxHash(false)
          unwatch()
        }
      },
    })

    return txHash
  }

  const bridgeMutation = useMutation({
    mutationFn: handleBridge,
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
            <Text fontWeight="bold">Bridge</Text>
            <TokenSelectDialog
              feature="bridge"
              fromChain={inputChain}
              isDevnet={true}
              onChange={setToken}
              value={token}
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
                From
              </Text>
              <BalanceDisplay chain={inputChain} onMax={(balance) => setInputAmount(balance)} token={token} />
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

              <ChainSelectPopover onChange={setOutputChain} value={outputChain} />
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

      {bridgeMutation.isSuccess && (
        <Stack borderRadius={16} borderWidth={1} fontSize="sm" maxW={420} p={4}>
          <Text color="primary.main" fontWeight="semibold">
            Transaction Receipt:
          </Text>

          <SimpleGrid gap={2} templateColumns="80px 1fr">
            <Text>Send: </Text>
            <Link
              fontFamily="mono"
              href={`${inputChain?.blockExplorers?.default.url}/tx/${bridgeMutation.data}`}
              target="_blank"
              w="fit-content"
            >
              {shortenAddress(bridgeMutation.data)}
              <RxOpenInNewWindow />
            </Link>
            <Text>Receive:</Text>
            <Link
              fontFamily="mono"
              href={`${outputChain?.blockExplorers?.default.url}/tx/${receiveTxHash}`}
              target="_blank"
              w="fit-content"
            >
              {loadingTxHash ? (
                <Spinner size="sm" />
              ) : (
                <>
                  {shortenAddress(receiveTxHash)}
                  <RxOpenInNewWindow />
                </>
              )}
            </Link>
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  )
}

export default BridgeBox
