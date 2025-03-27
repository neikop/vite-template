import { Box } from "@mui/material"
import { AppHeader } from "containers"
import { useResponsive } from "hooks"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { createSearchParams, Navigate, Route, Routes, useLocation, useNavigate } from "react-router"
import { profileSelector } from "reducers/profileSlice"
import { authRoute, privateRoute } from "routes"

const PrivateLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDesktop } = useResponsive()
  const { isLoggedIn, permissions } = useSelector(profileSelector)

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(
        {
          pathname: authRoute.login.url,
          search: createSearchParams({ callbackUrl: location.pathname }).toString(),
        },
        { replace: true },
      )
    }
  }, [isLoggedIn, location.pathname, navigate])

  return (
    <main className="flex flex-col" style={isDesktop ? { marginLeft: "320px" } : {}}>
      <AppHeader />
      <Box
        className="px-4 py-6 sm:px-6"
        flex={1}
        id="page"
        overflow="auto"
        sx={{
          minHeight: {
            sm: `calc(100vh - 64px)`,
            xs: `calc(100vh - 56px)`,
          },
        }}
      >
        <Routes>
          {Object.values(privateRoute).map(({ component: Element, path, ...route }) => {
            const requiredPermission = "requiredPermission" in route ? route.requiredPermission : ""
            const notSigninYet = !permissions
            const notRequiredPermission = !requiredPermission
            const hasPermission = permissions?.includes(requiredPermission!)
            return notSigninYet || notRequiredPermission || hasPermission ? (
              <Route element={<Element />} key={path} path={path} />
            ) : null
          })}
          <Route element={<Navigate to={privateRoute.home.path} />} path="*" />
        </Routes>
      </Box>
    </main>
  )
}

export default PrivateLayout
