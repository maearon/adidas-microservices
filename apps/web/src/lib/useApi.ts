// lib/useApi.ts
import axios from "axios"
import { useRouter } from "next/navigation"
import { getRefreshToken, setTokens, clearTokens } from "@/lib/token"

const useApi = () => {
  const router = useRouter()
  const api = axios.create({ baseURL: "http://localhost:8080/api" })

  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          clearTokens()
          router.push("/sign-in")
          return Promise.reject(error)
        }

        try {
          const res = await axios.post("http://localhost:8080/api/refresh", {
            refresh_token: refreshToken,
          })

          const newToken = res.data.token
          const newRefresh = res.data.refresh_token
          const remember = !!localStorage.getItem("token")
          setTokens(newToken, newRefresh, remember)

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (err) {
          clearTokens()
          router.push("/sign-in")
          return Promise.reject(err)
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}

export default useApi
