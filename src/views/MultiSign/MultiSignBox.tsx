import { Button, ButtonGroup, Center, Flex, Link, SimpleGrid, Span, Spinner, Stack, Text } from "@chakra-ui/react"
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
import { useMultiSignStore } from "store/multiSignStore"
import { shortenAddress } from "utils/common"
import { createPublicClient, http, parseEther } from "viem"
import { useAccount, useSwitchChain, useWalletClient } from "wagmi"

const MultiSignBox = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const { setSignatures, signatures } = useMultiSignStore()

  const handleSign = async (index: number) => {
    if (!address || !walletClient) return

    const signature = await walletClient.signMessage({
      account: address,
      message: "Hello from Viem!",
    })

    const signedIndex = signatures.findIndex((item) => item.address === address)
    if (signedIndex > -1) {
      signatures[signedIndex] = {}
    }
    signatures[index] = { address, signature }
    setSignatures(signatures)
  }

  const handleClear = (index: number) => {
    signatures[index] = {}
    setSignatures(signatures)
  }

  return (
    <Stack gap={6}>
      {signatures.map((item, index) => {
        return (
          <Stack borderRadius={16} borderWidth={1} fontSize="sm" gap={4} key={index} p={4} w={420}>
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
              <Button onClick={() => handleClear(index)} rounded="full" w={120}>
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
        size="lg"
        variant="subtle"
      >
        Submit
      </Button>
    </Stack>
  )
}

export default MultiSignBox
