import { LoadingButton, LoadingButtonProps } from "@mui/lab"
import { Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { DialogCloseButton } from "components/common"
import { createContext, PropsWithChildren, useContext, useState } from "react"

type Options = {
  cancelButtonProps?: ButtonProps
  cancelText?: string
  confirmButtonProps?: LoadingButtonProps
  confirmText?: string
  message?: string
  onCancel?: () => void
  onConfirm?: () => void
  onConfirmAsync?: () => Promise<unknown>
  title?: string
}

type ContextProps = {
  openConfirm: (options?: Options) => void
}

const AlertContext = createContext<ContextProps | null>(null)

const AlertProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setOpen] = useState(false)
  const [alertOptions, setAlertOptions] = useState<Options>({})

  const openConfirm = (options?: Options) => {
    setAlertOptions(options ?? {})
    setOpen(true)
  }

  const {
    cancelButtonProps,
    cancelText = "Đóng",
    confirmButtonProps,
    confirmText = "Xác nhận",
    message = "Bạn có chắc muốn thực hiện hành động này?",
    onCancel,
    onConfirm,
    onConfirmAsync,
    title = "Xác nhận",
  } = alertOptions

  const confirmMutation = useMutation({ mutationFn: onConfirmAsync })

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  const handleConfirm = async () => {
    if (onConfirmAsync) {
      await confirmMutation.mutateAsync()
    }
    onConfirm?.()
    setOpen(false)
  }

  return (
    <AlertContext.Provider value={{ openConfirm }}>
      <Dialog maxWidth="xs" open={isOpen}>
        <DialogCloseButton onClick={handleCancel} />
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant="outlined" {...cancelButtonProps}>
            {cancelText}
          </Button>
          <LoadingButton
            color="error"
            loading={confirmMutation.isPending}
            onClick={handleConfirm}
            variant="contained"
            {...confirmButtonProps}
          >
            {confirmText}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertProvider

export const useConfirmationDialog = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("Please use AlertProvider.")
  }
  return context
}
