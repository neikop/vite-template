import { MULTICALL_ADDRESSES, OFT_FACTORY } from "config/contracts"
import { getPublicClient } from "config/walletConnect"
import { OFTAdapterFactoryAbi } from "contracts/abis"
import { erc20Abi, getAddress } from "viem"
import { getTokenMetadata } from "./oft"

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

const fetchTokens = async (params?: TokensParams): Promise<TokensPagination> => {
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

  let _data = [...data]

  if (typeof params?.query === "string") {
    _data = _data.filter(
      (i) => i.address.toLowerCase().includes(params.query!.toLowerCase()) && params.chainId === i.chainId,
    )

    if (!_data.length && getAddress(params.query!)) {
      const publicClient = getPublicClient(+params.chainId)
      const token = getAddress(params.query!)

      if (publicClient && MULTICALL_ADDRESSES[+params.chainId]) {
        const tokenMetadata = await getTokenMetadata(token, 421614) // @todo check

        if (tokenMetadata.name && tokenMetadata.symbol) {
          let bridges: any = {}

          const oftFactory = OFT_FACTORY[+params.chainId]

          if (oftFactory) {
            if (params.chainId == 421614) {
              const oftResults = await publicClient.multicall({
                contracts: [
                  {
                    address: getAddress(oftFactory),
                    abi: OFTAdapterFactoryAbi,
                    functionName: "adapters",
                    args: [token],
                  },
                  {
                    address: getAddress(oftFactory),
                    abi: OFTAdapterFactoryAbi,
                    functionName: "destOFTs",
                    args: [token, 84004],
                  },
                  // @todo add other chain
                ],
                multicallAddress: MULTICALL_ADDRESSES[+params.chainId]!,
              })

              bridges[params.chainId] = oftResults[0].result
              bridges[84004] = oftResults[1].result
            } else if (params.chainId == 84004) {
              const oftResults = await publicClient.multicall({
                contracts: [
                  {
                    address: getAddress(oftFactory),
                    abi: OFTAdapterFactoryAbi,
                    functionName: "adapters",
                    args: [token],
                  },
                  {
                    address: getAddress(oftFactory),
                    abi: OFTAdapterFactoryAbi,
                    functionName: "destOFTs",
                    args: [token, 421614],
                  },
                  // @todo add other chain
                ],
                multicallAddress: MULTICALL_ADDRESSES[+params.chainId]!,
              })

              bridges[params.chainId] = oftResults[0].result
              bridges[421614] = oftResults[1].result
            }
          }

          _data = [
            // @todo fetch token or create adapter
            // 0xd9f96278A0d722ED5b0977aA2f3f60cc5E885833

            {
              address: getAddress(params.query!),
              bridges: bridges,
              chainId: +params.chainId,
              decimals: 18,
              logoURI: "todo",
              name: tokenMetadata.name,
              symbol: tokenMetadata.symbol,
            },
          ]
        }
      }
    }
  }

  const filteredTokens = filterData(_data, params)

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
