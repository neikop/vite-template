type Address = `0x${string}`

type Token = {
  address: Address
  bridges?: Record<number, Address>
  chainId: number
  decimals: number
  intent?: {
    handler: Address
    isc: Address
  }
  isImport?: boolean
  logoURI: string
  name: string
  symbol: string
}
