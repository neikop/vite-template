import { oneMatrixDevnet } from "contracts/utils"
import { createPublicClient, http } from "viem"

export const devnetClient = createPublicClient({
  chain: oneMatrixDevnet,
  transport: http(),
})
