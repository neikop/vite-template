type LoginBody = {
  password: string
  username: string
}

type LoginResponse = {
  accessToken?: string
  refreshToken?: string
  user?: User
}

type ProfileType = {
  id?: string
  isLoggedIn?: boolean
  isRoleAdmin?: boolean
  isRoleUser?: boolean
  isTypeAgency?: boolean
  isTypeProvider?: boolean
  isTypeSystem?: boolean
  permissions?: string[]
} & LoginResponse

type RegisterProviderBody = {
  email: string
  frontendUrl?: string
  password: string
  phone: string
  username: string
}

type EmailVerifyBody = {
  email: string
  token: string
}
