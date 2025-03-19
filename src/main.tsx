import App from "App"
import { AppProvider } from "container"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "index.css"
import "App.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
