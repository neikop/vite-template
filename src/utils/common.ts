export const shortenAddress = (address: Address | string = "", length: number = 4) => {
  return `${address.slice(0, 2 + length)}...${address.slice(-length)}`
}
