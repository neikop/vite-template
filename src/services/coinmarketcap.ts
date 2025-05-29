import Bera from "./Bera.json"
import Honey from "./Honey.json"

export const fetchHoneyPrices = () => {
  return Honey.data.points.map((point) => ({
    price: point.v[0],
    timestamp: +point.s,
  }))
}

export const fetchBeraPrices = () => {
  return Bera.data.points.map((point) => ({
    price: point.v[0],
    timestamp: +point.s,
  }))
}
