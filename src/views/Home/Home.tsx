import { Container } from "@chakra-ui/react"
import { useAccount, useWalletClient } from "wagmi"

const Home = () => {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  return (
    <Container>
      <div>HOME</div>
    </Container>
  )
}

export default Home
