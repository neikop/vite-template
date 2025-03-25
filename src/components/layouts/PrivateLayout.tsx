import { Box, Grid } from "@chakra-ui/react"
import { AppHeader, AppSidebar } from "components/app"
import { useEffect } from "react"
import { createSearchParams, Navigate, Route, Routes, useLocation, useNavigate } from "react-router"
import { authRoute, privateRoute } from "routes"
import { useProfileStore } from "store/profileStore"

const PrivateLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useProfileStore()

  useEffect(() => {
    if (!profile.isLoggedIn) {
      navigate(
        {
          pathname: authRoute.login.url,
          search: createSearchParams({ callbackUrl: location.pathname }).toString(),
        },
        { replace: true },
      )
    }
  }, [profile, location.pathname, navigate])

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
