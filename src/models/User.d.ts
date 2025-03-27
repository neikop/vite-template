type UserType = "AGENCY" | "PROVIDER" | "SYSTEM"
type UserRole = "ADMIN" | "USER"

type UserId = {
  id: string
}

type User = DBTimeAudit & {
  agency: Agency
  email?: string
  enabled: boolean
  firstName?: string
  id: string
  lastName?: string
  role: UserRole
  username: string
  userType: UserType
}

type ChangePasswordBody = {
  confirmNewPassword?: string
  newPassword: string
  oldPassword: string
}

type ResetPasswordBody = {
  confirmNewPassword?: string
  id: string
  newPassword: string
  oldPassword: string
}

type UserCreateBody = {
  agencyCode: string
  email: string
  firstName: string
  lastName: string
  password?: string
  role: string | UserRole
  username: string
  userType: string | UserType
}

type UserUpdateBody = {
  email: string
  firstName: string
  id: string
  lastName: string
}

type UserPermissions = {
  permissions: string[]
}
