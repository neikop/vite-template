import { Box, Grid } from "@chakra-ui/react"
import { AppHeader, AppSidebar } from "container"
import { Navigate, Route, Routes } from "react-router"
import { privateRoute } from "routes"

const PrivateLayout = () => {
  return (
    <Grid
      as="main"
      gridTemplateColumns="320px 1fr"
      gridTemplateRows="60px 1fr"
      h="100vh"
      templateAreas={`"sidebar header" "sidebar main"`}
    >
      <AppSidebar />
      <AppHeader />
      <Box gridArea="main" px={4} py={2}>
        <Routes>
          {Object.values(privateRoute).map(({ component: Element, path }) => (
            <Route element={<Element />} key={path} path={path} />
          ))}
          <Route element={<Navigate to={privateRoute.home.path} />} path="*" />
        </Routes>
      </Box>
    </Grid>
  )
}

export default PrivateLayout
