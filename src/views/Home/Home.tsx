import { fetchBeraPrices, fetchHoneyPrices } from "services/coinmarketcap"

import { timestamps } from "./input"

const honeyPrices = fetchHoneyPrices()

const beraPrices = fetchBeraPrices()

function findNearestPrices(timestamps: number[], prices: Price[]) {
  return timestamps.map((ts) => {
    let nearest = prices[0]
    let minDiff = Math.abs(ts - nearest.timestamp)

    for (let i = 1; i < prices.length; i++) {
      const diff = Math.abs(ts - prices[i].timestamp)
      if (diff < minDiff) {
        nearest = prices[i]
        minDiff = diff
      }
    }

    return nearest.price
  })
}

console.log("BERA", findNearestPrices(timestamps, beraPrices))
console.log("HONEY", findNearestPrices(timestamps, honeyPrices))

const Home = () => {
  return <div>HOME</div>
}

export default Home
