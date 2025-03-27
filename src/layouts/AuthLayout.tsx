import { Center } from "components/common"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Navigate, Route, Routes, useNavigate, useSearchParams } from "react-router"
import { profileSelector } from "reducers/profileSlice"
import { authRoute, privateRoute } from "routes"

const AuthLayout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isLoggedIn } = useSelector(profileSelector)

  useEffect(() => {
    if (isLoggedIn) {
      const callbackUrl = searchParams.get("callbackUrl")
      navigate(callbackUrl ?? privateRoute.home.path, { replace: true })
    }
  }, [isLoggedIn, searchParams, navigate])

  return (
    <main>
      <Center className="h-screen bg-black/5">
        <Routes>
          {Object.values(authRoute).map(({ component: Element, path }) => (
            <Route element={<Element />} key={path} path={path} />
          ))}
          <Route element={<Navigate to={authRoute.login.url} />} path="*" />
        </Routes>
      </Center>
    </main>
  )
}

export default AuthLayout
