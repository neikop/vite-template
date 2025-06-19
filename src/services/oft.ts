import { OFTAbi, OFTAdapterFactoryAbi, OFTFactoryAbi } from "contracts/abis"
import {
  Client,
  createWalletClient,
  encodeAbiParameters,
  encodePacked,
  erc20Abi,
  getAddress,
  http,
  keccak256,
  pad,
  parseAbiParameters,
  parseEventLogs,
  WalletClient,
  zeroAddress,
} from "viem"

import { getRelayer } from "./getRelayer"
import { getPublicClient } from "config/walletConnect"
import {
  EID,
  ENDPOINTS,
  MULTICALL_ADDRESSES,
  OFT_FACTORY,
  OFTAdapterCreationCode,
  OFTCreationCode,
} from "config/contracts"
import { ZeroAddress } from "ethers"

export const getTokenMetadata = async (token: Address, chainId: number) => {
  const tokenMetadata = await getPublicClient(chainId).multicall({
    contracts: [
      {
        abi: erc20Abi,
        address: token,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: token,
        functionName: "symbol",
      },
    ],
    multicallAddress: MULTICALL_ADDRESSES[chainId]!,
  })

  return {
    name: tokenMetadata[0].result ?? null,
    symbol: tokenMetadata[1].result ?? null,
  }
}

export const createOFTAdapter = async (chainId: number, token: Address, walletClient?: WalletClient) => {
  const bridges: Record<number, Address> = {}

  const tokenMetadata = await getTokenMetadata(token, chainId)

  if (!tokenMetadata.name || !tokenMetadata.symbol) return bridges

  try {
    if (chainId === 421614) {
      const { relayer } = getRelayer(84004)
      const relayerPublicClient = getPublicClient(84004)
      // create oft on devnet
      console.log("==== creating oft on devnet ====")

      let adapter = (await relayerPublicClient.readContract({
        address: getAddress(OFT_FACTORY[84004]),
        abi: OFTFactoryAbi,
        functionName: "adapters",
        args: [token],
      })) as Address
      if (adapter === ZeroAddress) {
        const tx = await relayer.writeContract({
          address: getAddress(OFT_FACTORY[84004]),
          abi: OFTFactoryAbi,
          functionName: "createOFT",
          args: [
            token,
            tokenMetadata.name,
            tokenMetadata.symbol,
            [EID[chainId]],
            [
              keccak256(
                encodePacked(
                  ["bytes", "bytes"],
                  [
                    OFTAdapterCreationCode as `0x${string}`,
                    encodeAbiParameters(parseAbiParameters("address, address, address"), [
                      token,
                      getAddress(ENDPOINTS[chainId]),
                      getAddress(OFT_FACTORY[chainId]),
                    ]),
                  ],
                ),
              ),
            ],
          ],
        })
        const txReceipt = await relayerPublicClient.waitForTransactionReceipt({
          hash: tx,
        })
        const events = parseEventLogs({
          abi: OFTFactoryAbi,
          logs: txReceipt.logs,
        })
        console.log("🚀 ~ oft.ts:103 ~ createOFTAdapter ~ events:", events)
        adapter = (events[0] as any)?.args?.oft ?? zeroAddress
      }

      // create adapter on source chain
      const publicClient = getPublicClient(chainId)
      let srcAdapter = (await publicClient.readContract({
        address: getAddress(OFT_FACTORY[chainId]),
        abi: OFTAdapterFactoryAbi,
        functionName: "adapters",
        args: [token],
      })) as Address

      if (adapter !== zeroAddress && srcAdapter === zeroAddress && walletClient?.account) {
        console.log("==== creating adapter on arb ====")
        const tx = await walletClient.writeContract({
          address: getAddress(OFT_FACTORY[chainId]),
          abi: OFTAdapterFactoryAbi,
          functionName: "createOFTAdapter",
          args: [
            token,
            [EID[84004]],
            [
              keccak256(
                encodePacked(
                  ["bytes", "bytes"],
                  [
                    OFTCreationCode as `0x${string}`,
                    encodeAbiParameters(parseAbiParameters("string, string, address, address"), [
                      tokenMetadata.name,
                      tokenMetadata.symbol,
                      getAddress(ENDPOINTS[84004]),
                      getAddress(OFT_FACTORY[84004]),
                    ]),
                  ],
                ),
              ),
            ],
          ], // adapter is peer in source chain
          chain: publicClient.chain,
          account: walletClient.account,
        })
        const txReceipt = await publicClient.waitForTransactionReceipt({ hash: tx })
        const events = parseEventLogs({
          abi: OFTAdapterFactoryAbi,
          logs: txReceipt.logs,
        })
        console.log("🚀 ~ oft.ts:103 ~ createOFTAdapter ~ events:", events)
        srcAdapter = (events[0] as any)?.args?.adapter ?? zeroAddress
      }

      bridges[chainId] = srcAdapter
      bridges[84004] = adapter
    }
  } catch (error) {
    console.log("🚀 ~ oft.ts:157 ~ createOFTAdapter ~ error:", error)
  }

  return bridges
}
