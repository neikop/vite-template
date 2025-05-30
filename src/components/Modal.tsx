import { IconButton } from "@chakra-ui/react"
import { PropsWithChildren } from "react"
import { createPortal } from "react-dom"

type Props = {
  isOpen: boolean
  onClose?: () => void
} & PropsWithChildren

const Modal = ({ children, isOpen, onClose }: Props) => {
  if (!isOpen) return null
  return createPortal(
    <div
      onClick={onClose}
      style={{
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "8px",
          maxWidth: "500px",
          padding: "2rem",
          position: "relative",
          width: "100%",
        }}
      >
        <IconButton onClick={onClose} style={{ position: "absolute", right: 16, top: 16 }}>
          X
        </IconButton>
        {children}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
