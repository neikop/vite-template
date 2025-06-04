type Address = `0x${string}`

type Token = {
  address: Address
  chainId: number
  decimals: number
  extensions: {
    bridgeInfo: Record<string, { tokenAddress: Address }>
  }
  logoURI: string
  name: string
  symbol: string
}
