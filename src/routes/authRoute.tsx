import { Box } from "@mui/material"
import { EmailVerifyScreen, LoginScreen, RegisterScreen } from "views/Auth"

const authRoute = {
  emailVerify: {
    component: EmailVerifyScreen,
    path: "/verify-email",
    url: "/auth/verify-email",
  },
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
