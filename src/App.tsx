import { AppProvider } from "containers"
import { AuthLayout, PrivateLayout } from "layouts"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router"
import { store } from "reducers/store"

const App = () => {
  return (
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthLayout />} path="/auth/*" />
            <Route element={<PrivateLayout />} path="/*" />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </Provider>
  )
}

export default App
