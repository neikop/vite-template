import { Box } from "@mui/material"
import { LoginScreen, RegisterScreen } from "views/Auth"

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
    component: RegisterScreen,
    path: "/register",
    url: "/auth/register",
  },
}

export default authRoute
