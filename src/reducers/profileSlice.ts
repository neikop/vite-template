import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { RootState } from "./store"

export const profileSlice = createSlice({
  initialState: {
    isLoggedIn: false,
  } as ProfileType,
  name: "profile",
  reducers: {
    signIn: (state, { payload }: PayloadAction<ProfileType>) => {
      const profile: ProfileType = {
        isLoggedIn: true,
        ...payload,
        id: payload.user?.id,
        isRoleAdmin: payload.user?.role === "ADMIN",
        isRoleUser: payload.user?.role === "USER",
        isTypeAgency: payload.user?.userType === "AGENCY",
        isTypeProvider: payload.user?.userType === "PROVIDER",
        isTypeSystem: payload.user?.userType === "SYSTEM",
        permissions: payload.permissions ?? state.permissions,
      }
      return profile
    },
    signOut: (state) => {
      const profile = { isLoggedIn: false } as ProfileType
      return profile
    },
    updatePermissions: (state, { payload: permissions }: PayloadAction<string[]>) => {
      return {
        ...state,
        permissions,
      }
    },
    updateUser: (state, { payload: user }: PayloadAction<User>) => {
      return {
        ...state,
        user,
      }
    },
  },
})

export const { signIn, signOut, updatePermissions, updateUser } = profileSlice.actions

export const profileSelector = ({ profile }: RootState) => profile
