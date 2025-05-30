import { Button } from "@chakra-ui/react"
import { getTxLogs } from "services/berascan"

import { txs } from "./input"

const decodeData = (data: string) => {
  const [amount0, amount1] = [data.substring(0, 66), "0x" + (data.substring(66) || "0")].map((hex) =>
    BigInt(hex).toString(),
  )
  // .map((amount) => amount.toString())
  return [amount0, amount1]
}

const handleTx = async (txHash: string) => {
  const { items: logs }: TxLogs = await getTxLogs(txHash)
  let amount0,
    amount1,
    LPBurn = "0",
    LPMint = "0",
    reserve0,
    reserve1

  logs.forEach((log) => {
    if (log.event.startsWith("Burn") || log.event.startsWith("Mint")) {
      ;[amount0, amount1] = decodeData(log.data)
    }
    if (log.event.startsWith("Sync")) {
      ;[reserve0, reserve1] = decodeData(log.data)
    }
  })
  const isMint = logs.some((log) => log.event.startsWith("Mint"))
  if (isMint) {
    ;[LPMint] = decodeData(logs[logs.length - 3].data)
  } else {
    ;[LPBurn] = decodeData(logs[0].data)
  }

  return `${txHash}\t${reserve0}\t${reserve1}\t${amount0}\t${amount1}\t${LPBurn}\t${LPMint}`
}

const Hotel = () => {
  const handleTxs = async () => {
    const data = await Promise.all(txs.map((txHash) => handleTx(txHash))).then((data) => data.join("\n"))
    console.log(data)
  }

  return (
    <div>
      HOTEL
      <Button onClick={() => handleTxs()}>Get Tx</Button>
    </div>
  )
}

export default Hotel
