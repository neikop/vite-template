import { QueryClientProvider } from "@tanstack/react-query"
import { SnackbarCloseButton } from "components/common"
import { AppHooks, AppTheme } from "containers"
import { AlertProvider } from "hooks"
import { SnackbarProvider } from "notistack"
import { PropsWithChildren } from "react"
import { Provider } from "react-redux"
import { store } from "reducers/store"
import { queryClient } from "services"

const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <SnackbarProvider
        action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
        autoHideDuration={5000}
        preventDuplicate
        variant="success"
      >
        <QueryClientProvider client={queryClient}>
          <AppHooks>
            <AppTheme>
              <AlertProvider>{children}</AlertProvider>
            </AppTheme>
          </AppHooks>
        </QueryClientProvider>
      </SnackbarProvider>
    </Provider>
  )
}

export default AppProvider
