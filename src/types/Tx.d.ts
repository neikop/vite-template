type Price = {
  price: number
  timestamp: number
}

type TxLog = {
  data: string
  event: string
}

type TxLogs = {
  items: TxLog[]
}
