import { MyModal } from "components/Dialog"
import { useEffect, useState } from "react"

const Hotel = () => {
  const [isOpen, setOpen] = useState(false)
  const [isOpen2, setOpen2] = useState(false)

  useEffect(() => {
    // setOpen(true)
    // setTimeout(() => {
    //   setOpen2(true)
    // }, 1000)
  }, [])

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal 1</button>
      <button onClick={() => setOpen2(true)}>Open Modal 2</button>
      <MyModal isOpen={isOpen} onClose={() => setOpen(false)}>
        <div>Childern</div>
        <button onClick={() => setOpen2(true)}>Open Modal 2</button>
      </MyModal>
      <MyModal isOpen={isOpen2} onClose={() => setOpen2(false)}>
        <div>Childern 2</div>
        <button onClick={() => setOpen(true)}>Open Modal 1</button>
      </MyModal>
    </div>
  )
}

export default Hotel
