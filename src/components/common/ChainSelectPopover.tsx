import { Button, Image, Popover, Portal, Stack, useDisclosure } from "@chakra-ui/react"
import { Chain } from "@rainbow-me/rainbowkit"
import { useState } from "react"
import { MdExpandMore } from "react-icons/md"
import { defineChain } from "viem"
import { arbitrum, mainnet } from "viem/chains"

const onematrix: Chain = defineChain({
  blockExplorers: {
    default: { name: "OneMatrix Explorer", url: "https://devnet-explorer.hiee.us" },
  },
  id: 84004,
  name: "OneMatrix",
  nativeCurrency: { decimals: 18, name: "MTX", symbol: "MTX" },
  rpcUrls: {
    default: {
      http: ["https://devnet-el-1.vinid.info"],
    },
  },
  testnet: true,
})

const onematrixL2: Chain = defineChain({
  blockExplorers: {
    default: { name: "OneMatrix Explorer", url: "https://devnet-l2-explorer.hiee.us" },
  },
  id: 8400201,
  name: "OneMatrix L2",
  nativeCurrency: { decimals: 18, name: "1MTX", symbol: "1MTX" },
  rpcUrls: {
    default: {
      http: ["https://devnet-l2.hiee.us"],
    },
  },
  testnet: true,
})

export const bridgeChains: Chain[] = [
  { ...mainnet, iconUrl: "https://blockscout-icons.s3.us-east-1.amazonaws.com/ethereum.svg" },
  { ...arbitrum, iconUrl: "https://blockscout-icons.s3.us-east-1.amazonaws.com/arbitrum.svg" },
  { ...onematrix, iconUrl: "https://eth.blockscout.com/assets/favicon/favicon.ico" },
  { ...onematrixL2, iconUrl: "https://zksync.blockscout.com/assets/favicon/favicon.ico" },
]

const ChainSelectPopover = () => {
  const { onClose, open, setOpen } = useDisclosure()

  const [selectedChain, setSelectedChain] = useState<Chain>()

  return (
    <Popover.Root onOpenChange={({ open }) => setOpen(open)} open={open} positioning={{ placement: "bottom-end" }}>
      <Popover.Trigger asChild>
        <Button colorPalette="purple" rounded="full" size="xs" variant="surface">
          {selectedChain ? (
            <>
              <Image h={6} src={selectedChain.iconUrl as string} />
              {selectedChain.name}
            </>
          ) : (
            "Select Chain"
          )}
          <MdExpandMore />
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body p={4}>
              <Stack gap={1}>
                {bridgeChains.map((chain) => {
                  const isSelected = chain.id === selectedChain?.id
                  return (
                    <Button
                      borderColor="transparent"
                      colorPalette={isSelected ? "purple" : "gray"}
                      justifyContent="flex-start"
                      key={chain.id}
                      onClick={() => {
                        setSelectedChain(chain)
                        onClose()
                      }}
                      px={2}
                      rounded="full"
                      variant={isSelected ? "surface" : "outline"}
                    >
                      <Image h={6} src={chain.iconUrl as string} />
                      {chain.name}
                    </Button>
                  )
                })}
              </Stack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export default ChainSelectPopover
