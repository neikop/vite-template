import { oneMatrixDevnet } from "contract/utils"
import { createPublicClient, http } from "viem"

export const devnetClient = createPublicClient({
  chain: oneMatrixDevnet,
  transport: http(),
})
