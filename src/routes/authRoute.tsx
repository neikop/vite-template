import { Box } from "@chakra-ui/react"
import { LoginScreen } from "views/Auth"

const authRoute = {
  forgotPassword: {
    component: Box,
    path: "/forgot-password",
    url: "/auth/forgot-password",
  },
  login: {
    component: LoginScreen,
    path: "/login",
    url: "/auth/login",
  },
  register: {
    component: Box,
    path: "/register",
    url: "/auth/register",
  },
}

export default authRoute
