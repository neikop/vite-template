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

type User = {
  agency: Agency
  email?: string
  enabled: boolean
  firstName?: string
  id: string
  lastName?: string
  role: UserRole
  username: string
  userType: UserType
} & DBTimeAudit

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

type UserId = {
  id: string
}

type UserPermissions = {
  permissions: string[]
}

type UserRole = "ADMIN" | "USER"

type UserType = "AGENCY" | "PROVIDER" | "SYSTEM"

type UserUpdateBody = {
  email: string
  firstName: string
  id: string
  lastName: string
}
