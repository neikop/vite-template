import { MULTICALL_ADDRESSES, OFT_FACTORY } from "config/contracts"
import { getPublicClient } from "config/walletConnect"
import { OFTAbi, OFTAdapterFactoryAbi, OFTFactoryAbi } from "contracts/abis"
import { ZeroAddress } from "ethers"
import {
  Client,
  createWalletClient,
  erc20Abi,
  getAddress,
  http,
  pad,
  parseEventLogs,
  WalletClient,
  zeroAddress,
} from "viem"

import { getRelayer } from "./getRelayer"

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
  if (chainId === 421614) {
    const { relayer } = getRelayer(84004)
    const relayerPublicClient = getPublicClient(84004)
    // create oft on devnet
    console.log("==== creating oft on devnet ====")

    let adapter = (await relayerPublicClient.readContract({
      abi: OFTFactoryAbi,
      address: getAddress(OFT_FACTORY[84004]),
      args: [token],
      functionName: "adapters",
    })) as Address

    if (adapter === ZeroAddress) {
      const tx = await relayer.writeContract({
        abi: OFTFactoryAbi,
        address: getAddress(OFT_FACTORY[84004]),
        args: [token, tokenMetadata.name, tokenMetadata.symbol],
        functionName: "newOFT",
      })
      const txReceipt = await relayerPublicClient.waitForTransactionReceipt({
        hash: tx,
      })
      const events = parseEventLogs({
        abi: OFTFactoryAbi,
        logs: txReceipt.logs,
      })
      console.log("🚀 ~ devnetService.ts:148 ~ fetchTokens ~ events:", events)

      adapter = (events[0] as any)?.args?.oft ?? zeroAddress
    }

    console.log("🚀 ~ oft.ts:80 ~ adapter:", adapter)

    // create adapter on source chain
    const publicClient = getPublicClient(chainId)
    let srcAdapter = (await publicClient.readContract({
      abi: OFTAdapterFactoryAbi,
      address: getAddress(OFT_FACTORY[chainId]),
      args: [token],
      functionName: "adapters",
    })) as Address

    if (adapter !== zeroAddress && srcAdapter === zeroAddress && walletClient?.account) {
      console.log("==== creating adapter on arb ====")
      const tx = await walletClient.writeContract({
        abi: OFTAdapterFactoryAbi,
        account: walletClient.account,
        address: getAddress(OFT_FACTORY[chainId]),
        args: [token, 84004, adapter], // adapter is peer in source chain
        chain: publicClient.chain,
        functionName: "oftAdapter",
      })
      const txReceipt = await publicClient.waitForTransactionReceipt({ hash: tx })
      const events = parseEventLogs({
        abi: OFTAdapterFactoryAbi,
        logs: txReceipt.logs,
      })
      console.log("🚀 ~ oft.ts:103 ~ createOFTAdapter ~ events:", events)
      srcAdapter = (events[0] as any)?.args?.adapter ?? zeroAddress
    }

    // set dest oft in devnet
    const oft = await relayerPublicClient.readContract({
      abi: OFTFactoryAbi,
      address: getAddress(OFT_FACTORY[84004]),
      args: [token, chainId],
      functionName: "destOFTs",
    })
    if (oft === zeroAddress && srcAdapter) {
      const tx = await relayer.writeContract({
        abi: OFTFactoryAbi,
        address: getAddress(OFT_FACTORY[84004]),
        args: [token, chainId, srcAdapter],
        functionName: "setDestOFT",
      })
      await relayerPublicClient.waitForTransactionReceipt({
        hash: tx,
      })
    }

    bridges[chainId] = srcAdapter
    bridges[84004] = adapter
  }

  return bridges
}
