import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { toaster } from "components/ui/toaster"
import { API_URL } from "config/env"
import { jwtDecode } from "jwt-decode"
import { authService } from "services"
import { useProfileStore } from "store/profileStore"

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean
}

const beforeRequest = (config: InternalAxiosRequestConfig) => {
  const { accessToken } = useProfileStore.getState().profile
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
  } catch {
    //
  }
  return config
}

let isRefreshing = false

const tryRefreshToken = async () => {
  if (isRefreshing) {
    await new Promise((resolve) => setTimeout(() => resolve(null), 100))
    await tryRefreshToken()
  } else {
    const { accessToken, refreshToken } = useProfileStore.getState().profile
    if (!accessToken || !refreshToken) {
      useProfileStore.getState().signOut()
    }
    const payload = jwtDecode(accessToken!)
    if (payload.exp! * 1e3 > new Date().getTime()) return

    isRefreshing = true
    await authService
      .refreshToken({ refreshToken })
      .then((refreshInfo) => {
        useProfileStore.getState().signIn(refreshInfo)
      })
      .catch(() => {
        // enqueueSnackbar("Phiên đăng nhập hết hạn", { key: "SESSION_EXPIRED", variant: "info" })
        useProfileStore.getState().signOut()
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
      const originalRequest = error.config as AxiosRequestConfigWithRetry
      if (!originalRequest._retry) {
        originalRequest._retry = true
        await tryRefreshToken()
        return client(originalRequest)
      } else {
        toaster.create({ title: "Phiên đăng nhập hết hạn", type: "info" })
        useProfileStore.getState().signOut()
      }
    } else {
      toaster.create({ title: data.message ?? "Lỗi không xác định", type: "error" })
    }
    if (status === 403) {
      //
    }
    if (status === 404) {
      //
    }
  } else {
    toaster.create({ title: "Lỗi kết nối đến hệ thống", type: "error" })
  }
  return Promise.reject(error)
}

const client = axios.create({ baseURL: API_URL + "/api" })
client.interceptors.request.use(beforeRequest)
client.interceptors.response.use(({ data }) => data, onError)

const authClient = axios.create({ baseURL: API_URL + "/api" })
authClient.interceptors.response.use(({ data }) => data, onError)

export { authClient, client }
