import { Button, Flex } from "@chakra-ui/react"
import { DateTime } from "luxon"
import { useState } from "react"
import { fetchLpTxs, getTxLogs } from "services/berascan"
import { fetchPrices } from "services/coinmarketcap"

const decodeData = (data: string) => {
  const [amount0, amount1] = [data.substring(0, 66), "0x" + (data.substring(66) || "0")].map((hex) =>
    BigInt(hex).toString(),
  )
  return [amount0, amount1]
}

const handleTx = async (txHash: string) => {
  const { items: logs } = await getTxLogs(txHash)
  let amount0 = "0",
    amount1 = "0",
    amountBurn = "0",
    amountMint = "0",
    reserve0 = "0",
    reserve1 = "0"

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
    ;[amountMint] = decodeData(logs[logs.length - 3].data)
  } else {
    ;[amountBurn] = decodeData(logs[0].data)
  }

  return {
    amount0,
    amount1,
    amountBurn,
    amountMint,
    reserve0,
    reserve1,
  }
}

const pairs: Record<string, `0x${string}`> = {
  "USDC.e/HONEY": "0xD81Fb3aF906F69b6bB956803ff93e42E20FD8382",
  "USDC.e/WBERA": "0x95eeb3B1e77C38bF270E3Db8ad164e7c01A37cb6",
  "WBERA/HONEY": "0x603D6a4E61417283eC0096921D2bDf1B57F122a3",
}

const Dynamic = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleClick = async (pair: string) => {
    setLoading({ [pair]: true })
    const txs = await fetchLpTxs({
      contractAddress: pairs[pair],
      // startBlock: 5808705,
    })
    if (txs.length === 0) {
      setLoading({ [pair]: false })
      return
    }

    const [beraPrices, honeyPrices] = await Promise.all([
      fetchPrices({ chartId: 24647, timeStamp: +txs[0].timeStamp }),
      fetchPrices({ chartId: 35670, timeStamp: +txs[0].timeStamp }),
    ])

    txs.forEach((tx) => {
      const timeStamp = Math.floor(+tx.timeStamp / 900) * 900
      tx.token0Price = beraPrices[timeStamp]
      tx.token1Price = honeyPrices[timeStamp]

      const burnAddress = "0x0000000000000000000000000000000000000000"
      if (tx.from === burnAddress) tx.action = "Add Liquidity"
      else if (tx.to === burnAddress) tx.action = "Remove Liquidity"
    })

    const dataLogs = await Promise.all(txs.map((tx) => handleTx(tx.hash)))
    dataLogs.forEach((log, index) => {
      txs[index].reserve0 = log.reserve0
      txs[index].reserve1 = log.reserve1
      txs[index].amount0 = log.amount0
      txs[index].amount1 = log.amount1
      txs[index].amountMint = log.amountMint
      txs[index].amountBurn = log.amountBurn
    })

    const data = txs
      .filter((tx) => !!tx.action)
      .map((tx) => {
        const dateTime = DateTime.fromSeconds(+tx.timeStamp).toFormat("yyyy-MM-dd HH:mm:ss")
        return (
          `${tx.hash}\t${tx.blockNumber}\t${tx.timeStamp}\t${dateTime}\t` +
          `${tx.from}\t${tx.to}\t${tx.value}\t${tx.action}\t` +
          `${tx.token0Price}\t${tx.token1Price}\t` +
          `${tx.reserve0}\t${tx.reserve1}\t${tx.amount0}\t${tx.amount1}\t${tx.amountMint}\t${tx.amountBurn}\n`
        )
      })
      .join("")

    console.log(data)
    setLoading({ [pair]: false })
  }

  return (
    <Flex gap={2}>
      {["WBERA/HONEY", "USDC.e/WBERA", "USDC.e/HONEY"].map((pair) => {
        return (
          <Button key={pair} loading={loading[pair]} onClick={() => handleClick(pair)}>
            {pair}
          </Button>
        )
      })}
    </Flex>
  )
}

export default Dynamic
