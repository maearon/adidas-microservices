import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/token";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  transformResponse: [
    (data) => {
      try {
        return JSON.parse(data, (key, value) => {
          if (typeof key === "string" && key.endsWith("At")) return new Date(value);
          return value;
        });
      } catch {
        return data;
      }
    },
  ],
});

// 🧩 Request: gắn token nếu có
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;

// 🔄 Response: nếu 403 thì refresh token & retry
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) return Promise.reject(error);
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          "/api/auth/refresh",
          { refresh_token: refreshToken },
          { withCredentials: true }
        );

        const newToken = data?.token;
        const newRefresh = data?.refresh_token;
        if (!newToken) throw new Error("Missing new token");

        setTokens(newToken, newRefresh, !!localStorage.getItem("token"));
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = "/sign-in";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
