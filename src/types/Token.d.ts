type Address = `0x${string}`

type Token = {
  address: Address
  chainId: number
  decimals: number
  intent?: {
    handler: Address
    isc: Address
  }
  logoURI: string
  name: string
  symbol: string
}
