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

type RegisterBody = {
  adress: string
  dateOfBirth: ISODateString
  email: string
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  sex: AccountSexType
}

type RegisterResponse = LoginResponse
