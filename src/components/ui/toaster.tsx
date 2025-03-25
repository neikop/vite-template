"use client"

import { Toaster as ChakraToaster, createToaster, Portal, Spinner, Stack, Toast } from "@chakra-ui/react"

export const toaster = createToaster({
  pauseOnPageIdle: true,
  placement: "top-end",
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster insetInline={{ mdDown: "4" }} toaster={toaster}>
        {(toast) => (
          <Toast.Root width={{ md: "sm" }}>
            {toast.type === "loading" ? <Spinner color="blue.solid" size="sm" /> : <Toast.Indicator />}
            <Stack flex="1" gap="1" maxWidth="full">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.meta?.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
