// 📦 Java Service (Spring Boot)
// Handles: Auth, Session, User, Password Reset APIs

import api from "@/api/client"
import { ApiResponse } from "@/types/common"
import {
  UserCreateParams,
  UserCreateResponse
} from "@/types/user"
import {
  SessionResponse,
  SessionIndexResponse,
  LoginParams,
  ResendActivationEmailParams,
  ResendActivationEmailResponse,
  PasswordResetCreateResponse,
  SendForgotPasswordEmailParams,
  PasswordResetUpdateParams,
  PasswordResetUpdateResponse,
  User
} from "@/types/auth"
import { handleNetworkError } from "@/components/shared/handleNetworkError"

const javaService = {
  // 🔐 Auth
  async checkEmail(email: string): Promise<{ exists: boolean; user: { activated: boolean } } | undefined> {
    try {
      const res = await api.post("/check-email", { email })
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async login(params: LoginParams): Promise<SessionResponse | undefined> {
    try {
      const res = await api.post("/login", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async register(params: UserCreateParams): Promise<UserCreateResponse | undefined> {
    try {
      const res = await api.post("/signup", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await api.delete("/logout")
    } catch (error: any) {
      handleNetworkError(error)
    }
  },

  // 👤 Session
  async getCurrentSession(): Promise<SessionIndexResponse | undefined> {
    try {
      const res = await api.get("/sessions")
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 🔄 Password Reset
  async sendForgotPasswordEmail(params: SendForgotPasswordEmailParams): Promise<PasswordResetCreateResponse | undefined> {
    try {
      const res = await api.post("/password-resets", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async resetForForgotPassword(reset_token: string, params: PasswordResetUpdateParams): Promise<PasswordResetUpdateResponse | undefined> {
    try {
      const res = await api.patch(`/password-resets/${reset_token}`, params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 📧 Account Activation
  async resendActivationEmail(params: ResendActivationEmailParams): Promise<ResendActivationEmailResponse | undefined> {
    try {
      const res = await api.post("/account_activations", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async activateAccount(activation_token: string, email: string): Promise<ApiResponse<User> | undefined> {
    try {
      const res = await api.patch(`/account_activations/${activation_token}`, { email })
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 🧪 Test route
  async test(): Promise<any> {
    try {
      const res = await api.get("/")
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  }
}

export default javaService
