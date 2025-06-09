const filterData = (items: Token[], params?: TokensParams) => {
  let filteredItems = items
  if (params?.chainId) {
    filteredItems = filteredItems.filter((token) => token.chainId === params.chainId)
  }
  return filteredItems
}

const fetchTokens = (params?: TokensParams): Promise<TokensPagination> => {
  const data: Token[] = [
    {
      address: "0xb4B575642D2E2bC23307288244507dD903c861d3",
      chainId: 84004,
      decimals: 18,
      intent: {
        handler: "0x39D169765CE219D54C94A8B32A7b141179415E05",
        isc: "0x08e2a0f80a3e98fDa6E014Da2601D7c9F514Df55",
      },
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      name: "USDC",
      symbol: "USDC",
    },
    {
      address: "0x2DCA5DAb33C32EE5ccB31c0c02F017a31ee2d863",
      bridges: {
        421_614: "0x2DCA5DAb33C32EE5ccB31c0c02F017a31ee2d863",
        84004: "0x54Df67faa5eb03D02F91906F6D54bDC9184cE3c8",
      },
      chainId: 421_614,
      decimals: 18,
      logoURI: "https://sepolia.arbiscan.io/assets/arbsepolia/images/svg/empty-token.svg?v=25.5.4.0",
      name: "aOFT",
      symbol: "aOFT",
    },
    {
      address: "0x54Df67faa5eb03D02F91906F6D54bDC9184cE3c8",
      bridges: {
        421_614: "0x2DCA5DAb33C32EE5ccB31c0c02F017a31ee2d863",
        84004: "0x54Df67faa5eb03D02F91906F6D54bDC9184cE3c8",
      },
      chainId: 84004,
      decimals: 18,
      logoURI: "https://sepolia.arbiscan.io/assets/arbsepolia/images/svg/empty-token.svg?v=25.5.4.0",
      name: "OFT",
      symbol: "OFT",
    },
  ]

  const { page = 1, pageSize = 10 } = params ?? {}

  const filteredTokens = filterData(data, params)

  return Promise.resolve({
    pagination: {
      totalItems: filteredTokens.length,
    },
    tokens: filteredTokens.slice((page - 1) * pageSize, page * pageSize),
  })
}

export default {
  fetchTokens,
}
