import { Chain, createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"

export const USDC = "0xb4B575642D2E2bC23307288244507dD903c861d3"

export const ISC = "0x08e2a0f80a3e98fDa6E014Da2601D7c9F514Df55"

export const HANDLER = "0x39D169765CE219D54C94A8B32A7b141179415E05"

export const TO = "0xd6F51739aD107e5D5F4eE02127504f2E7BFfA182"

export const DEVNET_RPC = "https://devnet-el-1.vinid.info/"

export const oneMatrixDevnet: Chain = {
  /** ID in number form */
  id: 84004,
  /** Human-readable name */
  name: "1Matrix Devnet",
  /** Internal network name */
  /** Currency used by chain */
  nativeCurrency: { decimals: 18, name: "1MT", symbol: "1MT" },
  /** Collection of RPC endpoints */
  rpcUrls: {
    default: {
      http: [DEVNET_RPC],
    },
    public: {
      http: [DEVNET_RPC],
    },
  },

  testnet: true,
}

export const getRelayer = () => {
  const rand = Math.round(Math.random())

  const relayerKeys = import.meta.env.VITE_RELAYER_KEY!.split(",")
  const relayerAddresses = import.meta.env.VITE_RELAYER_KEY_ADDRESS!.split(",")

  const account = privateKeyToAccount(relayerKeys[rand])

  const client = createWalletClient({
    account,
    chain: oneMatrixDevnet,
    transport: http(),
  })

  return {
    relayer: client,
    relayerAddress: relayerAddresses[rand],
  }
}
