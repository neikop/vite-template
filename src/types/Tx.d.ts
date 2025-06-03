type Address = `0x${string}`

type Price = {
  price: number
  timeStamp: number
}

type TokenTransfer = {
  action: "Add Liquidity" | "Remove Liquidity"
  amount0: string
  amount1: string
  amountBurn: string
  amountMint: string
  blockHash: string
  blockNumber: string
  confirmations: string
  contractAddress: string
  cumulativeGasUsed: string
  from: string
  gas: string
  gasPrice: string
  gasUsed: string
  hash: string
  input: string
  nonce: string
  reserve0: string
  reserve1: string
  timeStamp: string
  to: string
  token0Price: number
  token1Price: number
  tokenDecimal: string
  tokenName: string
  tokenSymbol: string
  transactionIndex: string
  value: string
}

type TransactionLog = {
  data: string
  event: string
}
