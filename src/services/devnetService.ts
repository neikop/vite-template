import { MULTICALL_ADDRESSES, OFT_FACTORY } from "config/contracts"
import { getPublicClient } from "config/walletConnect"
import { OFTAdapterFactoryAbi } from "contracts/abis"
import { getAddress } from "viem"

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
        421_614: "0xa2384079888B9F5Bf7a2e0387C12C70d810f3e5B",
        84004: "0x281138d955531d6438a391a3676e54728B9FCC3C",
      },
      chainId: 421_614,
      decimals: 18,
      logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
      name: "USDT",
      symbol: "USDT",
    },
    {
      address: "0x281138d955531d6438a391a3676e54728B9FCC3C",
      bridges: {
        421_614: "0xa2384079888B9F5Bf7a2e0387C12C70d810f3e5B",
        84004: "0x281138d955531d6438a391a3676e54728B9FCC3C",
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

  if (typeof params?.query === "string" && params.chainId) {
    _data = _data.filter(
      (i) => i.address.toLowerCase().includes(params.query!.toLowerCase()) && params.chainId === i.chainId,
    )

    if (!_data.length && getAddress(params.query!)) {
      const publicClient = getPublicClient(+params.chainId)
      let token = getAddress(params.query!)

      const oftFactory = OFT_FACTORY[+params.chainId]
      const multicall = MULTICALL_ADDRESSES[+params.chainId]

      if (publicClient && multicall) {
        if (params.chainId == 421614) {
          const tokenMetadata = await getTokenMetadata(token, 421614) // @todo check

          if (tokenMetadata.name && tokenMetadata.symbol) {
            let bridges: any = {}

            if (oftFactory) {
              const oftResults = await publicClient.multicall({
                contracts: [
                  {
                    abi: OFTAdapterFactoryAbi,
                    address: getAddress(oftFactory),
                    args: [token],
                    functionName: "adapters",
                  },
                  {
                    abi: OFTAdapterFactoryAbi,
                    address: getAddress(oftFactory),
                    args: [token, 84004],
                    functionName: "destOFTs",
                  },
                  // @todo add other chain
                ],
                multicallAddress: getAddress(multicall),
              })

              bridges[params.chainId] = oftResults[0].result
              bridges[84004] = oftResults[1].result
            }

            _data = [
              {
                address: token,
                bridges: bridges,
                chainId: +params.chainId,
                decimals: 18,
                logoURI: "todo",
                name: tokenMetadata.name,
                symbol: tokenMetadata.symbol,
              },
            ]
          }
        } else if (params.chainId == 84004) {
          let bridges: any = {}

          let tokenMetadata: { name: string | null; symbol: string | null } = { name: null, symbol: null }

          if (oftFactory) {
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

            bridges[params.chainId] = token
            bridges[421614] = oftResults[1].result

            const arbPublicClient = getPublicClient(421614)

            const rootToken = (await arbPublicClient.readContract({
              address: getAddress(OFT_FACTORY[421614]),
              abi: OFTAdapterFactoryAbi,
              functionName: "adapters",
              args: [oftResults[1].result],
            })) as Address

            tokenMetadata = await getTokenMetadata(rootToken, 421614) // @todo check
          }

          if (tokenMetadata.name && tokenMetadata.symbol) {
            _data = [
              {
                address: getAddress(token),
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
