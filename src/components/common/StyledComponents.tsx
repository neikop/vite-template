import { Box, styled, Typography } from "@mui/material"

export const Flex = styled(Box)(() => ({
  display: "flex",
}))

export const FlexColumn = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}))

export const Center = styled(Box)(() => ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
}))

export const Text = styled(Typography)(() => ({
  display: "block",
}))

export const Span = styled(Box)(() => ({
  display: "inline",
}))
