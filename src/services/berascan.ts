import axios from "axios"
import { reverse, uniqBy } from "lodash"

// WBERA-HONEY: 0x603D6a4E61417283eC0096921D2bDf1B57F122a3
// USDC.e-WBERA: 0x95eeb3B1e77C38bF270E3Db8ad164e7c01A37cb6
// USDC.e-HONEY: 0xD81Fb3aF906F69b6bB956803ff93e42E20FD8382

const apiKey = "IKY7CA1Z4P47DKFZC4GT3CAGH7S9175RZW"

export const getTxLogs = async (txHash: string): Promise<Pagination<TransactionLog>> => {
  const { data } = await axios.get(`https://cdn.routescan.io/api/blockchain/80094/tx/${txHash}/logs`)
  return data
}

export const fetchLpTxs = async (params: { contractAddress: Address; startBlock?: number }) => {
  const { data } = await axios.get("https://api.berascan.com/api", {
    params: {
      action: "tokentx",
      module: "account",
      ...params,
      apiKey,
      endBlock: "latest",
      sort: "desc",
      startBlock: params.startBlock ? params.startBlock + 1 : undefined,
    },
  })
  const items: TokenTransfer[] = data.result
  return reverse(uniqBy(items, "hash"))
}
