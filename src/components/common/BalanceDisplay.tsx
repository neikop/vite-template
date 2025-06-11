import { Button, Flex, Text } from "@chakra-ui/react"
import { Chain } from "@rainbow-me/rainbowkit"
import { useQuery } from "@tanstack/react-query"
import { ERC20Abi } from "contracts/abis"
import { createPublicClient, formatEther, http } from "viem"
import { useAccount } from "wagmi"

type Props = {
  chain?: Chain | null
  onMax?: (balance: string) => void
  token?: null | Token
}

const BalanceDisplay = ({ chain, onMax, token }: Props) => {
  const { address } = useAccount()

  const fetchBalance = async (): Promise<bigint> => {
    if (!address || !chain || !token) return 0n
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    })
    const balance = await publicClient.readContract({
      abi: ERC20Abi,
      address: token.chainId === 421614 ? token.address : token.bridges![token.chainId],
      args: [address],
      functionName: "balanceOf",
    })
    return balance as bigint
  }

  const { data: balance } = useQuery({
    queryFn: () => fetchBalance(),
    queryKey: ["fetchBalance", { address, chain, token }],
  })

  const formattedBalance = formatEther(balance || 0n)

  return (
    <Flex gap={2}>
      <Text fontSize="sm">Balance: {formattedBalance}</Text>
      <Button
        colorPalette="purple"
        onClick={() => {
          onMax?.(formattedBalance)
        }}
        variant="text"
      >
        Max
      </Button>
    </Flex>
  )
}

export default BalanceDisplay
