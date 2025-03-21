import { AppProvider } from "container"
import { AuthLayout, PrivateLayout } from "layouts"
import { BrowserRouter, Route, Routes } from "react-router"

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout />} path="/auth/*" />
          <Route element={<PrivateLayout />} path="/*" />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
