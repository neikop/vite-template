import axios from "axios"

export const fetchPrices = async (params: { chartId: number; timeStamp: number }) => {
  const { chartId: id, timeStamp } = params
  const timeStart = Math.floor(timeStamp / 900) * 900
  const { data } = await axios.get(`https://api.coinmarketcap.com/data-api/v3.3/cryptocurrency/detail/chart`, {
    params: {
      id,
      interval: "15m",
      timeStart,
    },
  })
  const points = data.data.points as { s: string; v: number[] }[]
  // return data.data.points.map((point: any) => ({
  //   price: point.v[0],
  //   timeStamp: +point.s,
  // })) as Price[]
  const prices = points.reduce(
    (prices, item) => {
      prices[item.s] = item.v[0]
      return prices
    },
    {} as Record<string, number>,
  )
  return prices
}
