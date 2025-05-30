import { Button, Flex } from "@chakra-ui/react"
import Modal from "components/Modal"
import { useToast } from "context/ToastContext"
import { useState } from "react"

const Home = () => {
  const { showToast } = useToast()

  const [isOpen, setOpen] = useState(false)
  const [isOpen2, setOpen2] = useState(false)

  return (
    <div>
      <Flex gap={2}>
        <Button onClick={() => setOpen(true)}>Open Modal 1</Button>
        <Button onClick={() => setOpen2(true)}>Open Modal 2</Button>

        <Button onClick={() => showToast({ message: "This is a success message!", type: "success" })}>
          Show Success Toast
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
        <div>Modal 1</div>
        <Button onClick={() => setOpen2(true)}>Open Modal 2</Button>
      </Modal>
      <Modal isOpen={isOpen2} onClose={() => setOpen2(false)}>
        <div>Modal 2</div>
        <Button onClick={() => setOpen(true)}>Open Modal 1</Button>
      </Modal>
    </div>
  )
}

export default Home
