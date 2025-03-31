import { authClient as client } from "./axios"

const login = (body: LoginBody): Promise<LoginResponse> => client.post(`/auth/login`, body)
const logout = () => client.post(`/auth/logout`)
const registerProvider = (body: RegisterProviderBody): Promise<unknown> => client.post(`/auth/register-provider`, body)
const verifyEmail = (body: EmailVerifyBody): Promise<unknown> => client.post(`/auth/verify-email`, body)

const refreshToken = (body: { refreshToken?: string }): Promise<LoginResponse> =>
  client.post(`/auth/refresh-token`, body)

const authService = {
  login,
  logout,
  refreshToken,
  registerProvider,
  verifyEmail,
}

export default authService
