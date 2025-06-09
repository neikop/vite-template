import axios, { AxiosResponse } from "axios"

const fetchTokens = async () => {
  const { data }: AxiosResponse<{ tokens: Token[] }> = await axios.get(`https://ipfs.io/ipns/tokens.uniswap.org`)
  const availableTokens = data.tokens
  return availableTokens
}

export default {
  fetchTokens,
}
