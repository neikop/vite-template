import { createContext, PropsWithChildren, useCallback, useContext, useState } from "react"

type Toast = {
  duration?: number
  id: string
  message: string
  type?: ToastType
}

type ToastContextType = {
  showToast: (toast: Omit<Toast, "id">) => void
}

type ToastType = "error" | "info" | "success"

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const fullToast: Toast = { ...toast, id }
    setToasts((prev) => prev.concat(fullToast))

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div className={`toast ${toast.type}`} key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
