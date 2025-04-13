import { Box, Container } from "@chakra-ui/react"
import { AppHeader } from "components/app"
import { Navigate, Route, Routes } from "react-router"
import { publicRoute } from "routes"

const PublicLayout = () => {
  return (
    <Box bgColor="third.10" minH="100vh">
      <Container maxW={1600} py={10}>
        <AppHeader />
        <Routes>
          {Object.values(publicRoute).map(({ component: Element, path }) => (
            <Route element={<Element />} key={path} path={path} />
          ))}
          <Route element={<Navigate to={publicRoute.home.path} />} path="*" />
        </Routes>
      </Container>
    </Box>
  )
}

export default PublicLayout
