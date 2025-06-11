type Feature = "bridge" | "transfer"

type TokensPagination = {
  pagination: {
    totalItems: number
  }
  tokens: Token[]
}

type TokensParams = {
  walletClient?: any
  chainId: number | string
  feature?: Feature
  page?: number
  pageSize?: number
  query?: string
}
