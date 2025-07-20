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
  User,
  WithStatus
} from "@/types/auth"
import { handleNetworkError } from "@/components/shared/handleNetworkError"

const javaService = {
  // 🔐 Auth
  async checkEmail(email: string): Promise<{ exists: boolean; user: { activated: boolean } } | undefined> {
    try {
      const { data }  = await api.post<WithStatus<{ exists: boolean; user: { activated: boolean } }>>("/check-email", { email })
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async login(params: LoginParams): Promise<WithStatus<SessionResponse> | undefined> {
    try {
      const { data }  = await api.post<WithStatus<SessionResponse>>("/login", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async register(params: UserCreateParams): Promise<WithStatus<UserCreateResponse> | undefined> {
    try {
      const { data }  = await api.post<WithStatus<UserCreateResponse>>("/signup", params)
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
  async getCurrentSession(): Promise<WithStatus<SessionIndexResponse> | undefined> {
    try {
      const { data }  = await api.get<WithStatus<SessionIndexResponse>>("/sessions")
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 🔄 Password Reset
  async sendForgotPasswordEmail(params: SendForgotPasswordEmailParams): Promise<WithStatus<PasswordResetCreateResponse> | undefined> {
    try {
      const { data }  = await api.post<WithStatus<PasswordResetCreateResponse>>("/password-resets", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async resetForForgotPassword(reset_token: string, params: PasswordResetUpdateParams): Promise<WithStatus<PasswordResetUpdateResponse> | undefined> {
    try {
      const { data }  = await api.patch<WithStatus<PasswordResetUpdateResponse>>(`/password-resets/${reset_token}`, params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 📧 Account Activation
  async resendActivationEmail(params: ResendActivationEmailParams): Promise<WithStatus<ResendActivationEmailResponse> | undefined> {
    try {
      const { data }  = await api.post<WithStatus<ResendActivationEmailResponse>>("/account_activations", params)
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  async activateAccount(activation_token: string, email: string): Promise<WithStatus<ApiResponse<User>> | undefined> {
    try {
      const { data }  = await api.patch<WithStatus<ApiResponse<User>>>(`/account_activations/${activation_token}`, { email })
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  },

  // 🧪 Test route
  async test(): Promise<any> {
    try {
      const { data }  = await api.get<any>("/")
      return res
    } catch (error: any) {
      handleNetworkError(error)
      throw error
    }
  }
}

export default javaService
