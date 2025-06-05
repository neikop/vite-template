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
      address: "0x326F07743bf73c6E7b7A08Cf70d8a3d41a0c196c",
      chainId: 84004,
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
      name: "WETH",
      symbol: "WETH",
    },
    {
      address: "0xf0cd672A24c959C9b049812754E4268AC411501c",
      chainId: 84004,
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png",
      name: "MyToken",
      symbol: "MTK",
    },
  ]

  const { page = 1, pageSize = 10 } = params ?? {}
  return Promise.resolve({
    pagination: {
      totalItems: data.length,
    },
    tokens: data.slice((page - 1) * pageSize, page * pageSize),
  })
}

export default {
  fetchTokens,
}
