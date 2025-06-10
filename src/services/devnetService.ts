const filterData = (items: Token[], params?: TokensParams) => {
  let filteredItems = items
  if (params?.chainId) {
    filteredItems = filteredItems.filter((token) => token.chainId === params.chainId)
  }
  if (params?.feature === "bridge") {
    filteredItems = filteredItems.filter((token) => !!token.bridges)
  }
  return filteredItems
}

const fetchTokens = (params?: TokensParams): Promise<TokensPagination> => {
  const data: Token[] = [
    {
      address: "0x974BEdB866852dbB57dC7B025af528e51968DF1C",
      chainId: 84004,
      decimals: 18,
      intent: {
        handler: "0xc8207E393892ce27F294661D11305DC4a91F10bd",
        isc: "0x4A0C49396e6ceDBD53f00d8373b4f5E3754Df74a",
      },
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
      name: "USDC",
      symbol: "USDC",
    },
    {
      address: "0x25052ec0e31e8a4b3945a0700f56c5b74988b496",
      bridges: {
        421_614: "0xC78d96e897C17D7113E3dDa20B693eb799Ebee23",
        84004: "0xb313472eDe54230E2397f5d1D0Dd9FAa5D28828D",
      },
      chainId: 421_614,
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      name: "USDT",
      symbol: "USDT",
    },
    {
      address: "0xb313472eDe54230E2397f5d1D0Dd9FAa5D28828D",
      bridges: {
        421_614: "0xC78d96e897C17D7113E3dDa20B693eb799Ebee23",
        84004: "0xb313472eDe54230E2397f5d1D0Dd9FAa5D28828D",
      },
      chainId: 84004,
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      name: "USDT",
      symbol: "USDT",
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
