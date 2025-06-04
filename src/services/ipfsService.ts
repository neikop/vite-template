import axios, { AxiosResponse } from "axios"
import { bridgeChains } from "components/common/ChainSelectPopover"

const fetchTokens = async () => {
  const { data }: AxiosResponse<{ tokens: Token[] }> = await axios.get(`https://ipfs.io/ipns/tokens.uniswap.org`)
  const availableTokens = data.tokens.filter((token) => bridgeChains.some((chain) => chain.id === token.chainId))
  return availableTokens
}

export default {
  fetchTokens,
}
