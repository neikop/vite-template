import { AppProvider } from "components/app"
import { AuthLayout, PrivateLayout } from "components/layouts"
import { ToastProvider } from "context/ToastContext"
import { BrowserRouter, Route, Routes } from "react-router"

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            <Route element={<AuthLayout />} path="/auth/*" />
            <Route element={<PrivateLayout />} path="/*" />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
