import { Button, Flex, Text } from "@chakra-ui/react"
import { Chain } from "@rainbow-me/rainbowkit"
import { useQuery } from "@tanstack/react-query"
import { createPublicClient, formatEther, http } from "viem"
import { useAccount } from "wagmi"

type Props = {
  chain?: Chain | null
  token?: null | Token
}

const BalanceDisplay = ({ chain, token }: Props) => {
  const { address } = useAccount()

  const fetchBalance = async (): Promise<bigint> => {
    if (!address || !chain || !token) return 0n
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    })
    return publicClient.getBalance({ address })
  }

  const { data: balance } = useQuery({
    queryFn: () => fetchBalance(),
    queryKey: ["fetchBalance", { address, chain, token }],
  })

  return (
    <Flex gap={2}>
      <Text fontSize="sm">Balance: {formatEther(balance || 0n)}</Text>
      <Button colorPalette="purple" variant="text">
        Max
      </Button>
    </Flex>
  )
}

export default BalanceDisplay
