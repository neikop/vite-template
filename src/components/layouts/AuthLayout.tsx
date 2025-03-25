import { Center } from "@chakra-ui/react"
import { useEffect } from "react"
import { Navigate, Route, Routes, useNavigate, useSearchParams } from "react-router"
import { authRoute, privateRoute } from "routes"
import { useProfileStore } from "store/profileStore"

const AuthLayout = () => {
  const navigate = useNavigate()
  const { profile } = useProfileStore()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (profile.isLoggedIn) {
      const callbackUrl = searchParams.get("callbackUrl")
      navigate(callbackUrl ?? privateRoute.home.path, { replace: true })
    }
  }, [profile, searchParams, navigate])

  return (
    <Center as="main" bg="blackAlpha.50" h="100vh">
      <Routes>
        {Object.values(authRoute).map(({ component: Element, path }) => (
          <Route element={<Element />} key={path} path={path} />
        ))}
        <Route element={<Navigate to={authRoute.login.url} />} path="*" />
      </Routes>
    </Center>
  )
}

export default AuthLayout
