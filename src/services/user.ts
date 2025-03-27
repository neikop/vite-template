import { client } from "./axios"

const createUser = (body: UserCreateBody): Promise<User> => client.post(`/users`, body)
const changeUserPassword = (body: ChangePasswordBody): Promise<User> => client.patch(`/users/change-password`, body)
const fetchUsers = (params?: PaginateParams): Promise<PaginateResponse<User>> => client.get(`/users`, { params })
const getUser = ({ id }: UserId): Promise<User> => client.get(`/users/${id}`)
const updateUser = ({ id, ...body }: UserUpdateBody): Promise<User> => client.patch(`/users/${id}`, body)
const enableUser = ({ id }: UserId): Promise<User> => client.patch(`/users/${id}/enable`)
const disableUser = ({ id }: UserId): Promise<User> => client.patch(`/users/${id}/disable`)
const resetPasswordUser = ({ id, ...body }: ResetPasswordBody): Promise<User> =>
  client.patch(`/users/${id}/reset-password`, body)
const getMe = (): Promise<User> => client.get(`/users/me`)
const getPermissions = (): Promise<UserPermissions> => client.get(`/users/me/permissions`)

const userService = {
  changeUserPassword,
  createUser,
  disableUser,
  enableUser,
  fetchUsers,
  getMe,
  getPermissions,
  getUser,
  resetPasswordUser,
  updateUser,
}

export default userService
