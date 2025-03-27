import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { API_URL } from "env"
import { jwtDecode } from "jwt-decode"
import { enqueueSnackbar } from "notistack"
import { signIn, signOut } from "reducers/profileSlice"
import { store } from "reducers/store"
import { ErrorMap } from "utils/error"

import authService from "./auth"

const beforeRequest = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = store.getState().profile
  if (accessToken) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${accessToken}`,
    })
  }
  try {
    if (config.data instanceof FormData) {
      Object.assign(config.headers, {
        "Content-Type": "multipart/form-data",
      })
    }
  } catch {}
  return config
}

let isRefreshing = false
const tryRefreshToken = async () => {
  if (isRefreshing) {
    await new Promise((resolve) => setTimeout(() => resolve(null), 100))
    await tryRefreshToken()
  } else {
    const { accessToken, refreshToken } = store.getState().profile
    if (!accessToken || !refreshToken) {
      store.dispatch(signOut())
    }
    const payload = jwtDecode(accessToken!)
    if (payload.exp! * 1e3 > new Date().getTime()) return

    isRefreshing = true
    await authService
      .refreshToken({ refreshToken })
      .then((refreshInfo) => {
        store.dispatch(signIn(refreshInfo))
      })
      .catch(() => {
        enqueueSnackbar("Phiên đăng nhập hết hạn", { key: "SESSION_EXPIRED", variant: "info" })
        store.dispatch(signOut())
      })
      .finally(() => {
        isRefreshing = false
      })
  }
}

const onError = async (error: AxiosError<ErrorResponse, string>) => {
  const { response } = error
  if (response) {
    const { data, status } = response
    const isAuth = error.config?.url?.startsWith("/auth")
    if (!isAuth && status === 401) {
      const originalRequest = error.config as any
      if (!originalRequest._retry) {
        originalRequest._retry = true
        await tryRefreshToken()
        return client(originalRequest)
      } else {
        enqueueSnackbar("Phiên đăng nhập hết hạn", { key: "SESSION_EXPIRED", variant: "info" })
        store.dispatch(signOut())
      }
    } else {
      enqueueSnackbar(ErrorMap[data.message] ?? data.message ?? "Lỗi không xác định", { variant: "error" })
    }
    if (status === 403) {
      // window.location.replace("/errors/403")
    }
    if (status === 404) {
      // window.location.replace("/errors/404")
    }
  } else {
    enqueueSnackbar("Lỗi kết nối đến hệ thống", { variant: "error" })
  }
  return Promise.reject(error)
}

const client = axios.create({ baseURL: API_URL + "/api" })
client.interceptors.request.use(beforeRequest)
client.interceptors.response.use(({ data }) => data, onError)

const authClient = axios.create({ baseURL: API_URL + "/api" })
authClient.interceptors.response.use(({ data }) => data, onError)

export { authClient, client }
