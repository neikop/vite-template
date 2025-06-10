type TokensPagination = {
  pagination: {
    totalItems: number
  }
  tokens: Token[]
}

type TokensParams = {
  chainId?: number | string
  forBridge?: boolean
  page?: number
  pageSize?: number
  query?: string
}
