import { authClient as client } from "config/axios"

const login = (body: LoginBody): Promise<LoginResponse> => client.post(`/auth/login`, body)
const logout = () => client.post(`/auth/logout`)
const register = (body: RegisterBody): Promise<RegisterResponse> => client.post(`/auth/register`, body)
const refreshToken = (body: { refreshToken?: string }): Promise<LoginResponse> =>
  client.post(`/auth/refresh-token`, body)

const authService = {
  login,
  logout,
  refreshToken,
  register,
}

export default authService
