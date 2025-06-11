import { OFTAbi, OFTAdapterFactoryAbi, OFTFactoryAbi } from "contracts/abis"
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
import { getPublicClient } from "config/walletConnect"
import { MULTICALL_ADDRESSES, OFT_FACTORY } from "config/contracts"
import { ZeroAddress } from "ethers"

export const getTokenMetadata = async (token: Address, chainId: number) => {
  const tokenMetadata = await getPublicClient(chainId).multicall({
    contracts: [
      {
        address: token,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: token,
        abi: erc20Abi,
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
  let bridges: Record<number, Address> = {}

  const tokenMetadata = await getTokenMetadata(token, chainId)
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
        functionName: "newOFT",
        args: [token, tokenMetadata.name, tokenMetadata.symbol],
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
        functionName: "oftAdapter",
        args: [token, 84004, adapter], // adapter is peer in source chain
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

    // set dest oft in devnet
    let oft = await relayerPublicClient.readContract({
      address: getAddress(OFT_FACTORY[84004]),
      abi: OFTFactoryAbi,
      functionName: "destOFTs",
      args: [token, chainId],
    })
    if (oft === zeroAddress && srcAdapter) {
      const tx = await relayer.writeContract({
        address: getAddress(OFT_FACTORY[84004]),
        abi: OFTFactoryAbi,
        functionName: "setDestOFT",
        args: [token, chainId, srcAdapter],
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
