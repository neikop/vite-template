import Bera from "./Bera.json"
import Honey from "./Honey.json"

export const fetchHoneyPrices = () => {
  // https://api.coinmarketcap.com/data-api/v3.3/cryptocurrency/detail/chart?id=35670&interval=15m&timeStart=1747416085
  return Honey.data.points.map((point) => ({
    price: point.v[0],
    timestamp: +point.s,
  }))
}

export const fetchBeraPrices = () => {
  // https://api.coinmarketcap.com/data-api/v3.3/cryptocurrency/detail/chart?id=24647&interval=15m&timeStart=1747416085
  return Bera.data.points.map((point) => ({
    price: point.v[0],
    timestamp: +point.s,
  }))
}
