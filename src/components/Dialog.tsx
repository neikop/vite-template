import { PropsWithChildren, useEffect, useState } from "react"
import { addModal, closeModal, modalCount, modalMax } from "utils/modalCount"

type Props = {
  isOpen: boolean
  onClose?: () => void
} & PropsWithChildren

export const MyModal = ({ children, isOpen, onClose }: Props) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isOpen) {
      addModal()
      const count = modalMax()
      setCount(count)

      document.body.classList.add("overflow-hidden")
    } else {
      closeModal()

      const count = modalCount()
      if (count <= 0) {
        document.body.classList.remove("overflow-hidden")
      }
    }
  }, [isOpen])

  return (
    <>
      <div
        onClick={onClose}
        style={{
          alignItems: "center",
          background: "#0006",
          display: isOpen ? "flex" : "none",
          inset: 0,
          justifyContent: "center",
          position: "fixed",
          zIndex: count,
        }}
      ></div>
      <div
        style={{
          background: "white",
          border: "1px solid silver",
          borderRadius: 12,
          display: isOpen ? "inline-block" : "none",
          left: "50%",
          minHeight: 400,
          minWidth: 400,
          padding: 12,
          position: "fixed",
          top: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: count + 1,
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </>
  )
}
