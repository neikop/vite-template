import axios from "axios"

// WBERA-HONEY: 0x603D6a4E61417283eC0096921D2bDf1B57F122a3
// USDC.e-WBERA: 0x95eeb3B1e77C38bF270E3Db8ad164e7c01A37cb6
// USDC.e-HONEY: 0xD81Fb3aF906F69b6bB956803ff93e42E20FD8382

export const getTxLogs = (txHash: string) => {
  return axios.get(`https://cdn.routescan.io/api/blockchain/80094/tx/${txHash}/logs?limit=100`).then((res) => res.data)
}
