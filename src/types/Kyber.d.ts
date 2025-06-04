type TokensPagination = {
  pagination: {
    totalItems: number
  }
  tokens: Token[]
}

type TokensParams = {
  page?: number
  pageSize?: number
  query?: string
}
