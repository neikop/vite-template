type Feature = "bridge" | "transfer"

type TokensPagination = {
  pagination: {
    totalItems: number
  }
  tokens: Token[]
}

type TokensParams = {
  chainId?: number | string
  feature?: Feature
  page?: number
  pageSize?: number
  query?: string
  walletClient?: any
}
