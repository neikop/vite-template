import { Button, Container, Link, Stack, Text } from "@chakra-ui/react"
import { AbiCoder as AbiCoderV6 } from "@ethersproject/abi-v6"
import { useMutation } from "@tanstack/react-query"
import { toaster } from "components/ui/toaster"
import { ERC20Abi, ISCAbi } from "contracts/abis"
import { devnetClient } from "contracts/client"
import { getRelayer, HANDLER, ISC, TO, USDC } from "contracts/utils"
import {
  Address,
  encodeFunctionData,
  encodePacked,
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

const Home = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const handleSign = async () => {
    if (!address || !devnetClient || !walletClient) return

    const sections = []

    const roundedAmount = Math.floor(Math.random() * 1000) / 100
    const amount = parseEther(roundedAmount.toString())

    const to = TO

    const { relayer, relayerAddress } = getRelayer()

    sections.push({
      app: USDC, // ERC20 intent or adapter
      handler: HANDLER, // handler erc20 - 18 decimals
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
          owner: to,
          signer: zeroAddress,
          value: pad(toHex(amount), { size: 32 }),
        },
      ],
    })

    const nonce = await devnetClient.readContract({
      abi: ISCAbi,
      address: ISC,
      args: [address],
      functionName: "getNonce",
    })

    // Create the agreement
    const agreement: any = {
      nonce,
      resolverData: [pad(to, { size: 32 }), pad(address, { size: 32 }), pad(USDC, { size: 32 })],
      sections,
      signatures: [],
    }

    const formattedAgreement = await devnetClient.readContract({
      abi: ISCAbi,
      address: ISC,
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
          agreement.sections.map((section: any) => [
            section.handler,
            section.app,
            section.intents.map((intent: any) => [
              intent.owner,
              intent.key,
              intent.opcode,
              intent.value,
              intent.signer,
            ]),
          ]),
          agreement.signatures,
          agreement.resolverData,
        ],
      ],
    ) as Address

    const encodedFuncData = encodeFunctionData({
      abi: ERC20Abi,
      args: [address, to, amount],
      functionName: "transferFrom",
    })

    const data = encodePacked(
      ["bytes", "bytes", "uint256", "bytes32"],
      [encodedFuncData, agreementData, BigInt(size(agreementData)), keccak256(toBytes("intent.calldata.suffix"))],
    )

    const hash = await relayer.sendTransaction({
      data,
      from: relayerAddress,
      to: USDC,
    })

    const receipt = devnetClient.waitForTransactionReceipt({
      hash,
    })
    console.log("Tx receipt ", receipt)

    return hash
  }

  const signMutation = useMutation({
    mutationFn: handleSign,
    onSuccess: () => {
      toaster.create({
        description: "Your transaction was successfully sent",
        title: "Success",
        type: "success",
      })
    },
  })

  return (
    <Container>
      <Stack alignItems="flex-start" gap={2}>
        <Button
          colorPalette="purple"
          loading={signMutation.isPending}
          onClick={() => signMutation.mutateAsync()}
          px={10}
        >
          Sign
        </Button>

        <Text fontFamily="mono">
          Tx Hash:{" "}
          <Link
            _hover={{ color: "blue.600" }}
            color="blue.500"
            href={`https://devnet-explorer.hiee.us/tx/${signMutation.data}`}
            target="_blank"
          >
            {signMutation.data}
          </Link>
        </Text>
      </Stack>
    </Container>
  )
}

export default Home
