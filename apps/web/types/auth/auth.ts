// 🔐 Types for Password Reset feature

// 👇 Wrapper type for response + _status from interceptor
export type WithStatus<T> = T & { _status: number }

// Password Reset
export interface SendForgotPasswordEmailParams {
  password_reset: PasswordResetCreateField
}export interface PasswordResetCreateField {
  email: string
}

export interface PasswordResetCreateResponse {
  flash?: [message_type: string, message: string]
}

export interface PasswordResetUpdateParams {
  email: string
  user: {
    password: string
    password_confirmation: string
  }
}

export interface PasswordResetUpdateResponse {
  user_id?: string
  flash?: [message_type: string, message: string]
  error?: string[]
}

// Resend and Activate

export interface ResendActivationEmailField {
  email: string
}

export interface ResendActivationEmailParams {
  resend_activation_email: ResendActivationEmailField
}

export interface ResendActivationEmailResponse {
  user_id?: string
  flash?: [message_type: string, message: string]
  error?: string[]
}

export interface Response<User> {
  user?: User
  jwt?: string
  token?: string
  flash: [message_type: string, message: string]
}

// Auth-related types

// TODO: Add code here...

// ✅ Auth-related shared types for Java backend

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginParams {
  session: LoginCredentials
}

export interface TokenPair {
  token: string
  expires: string
}

export interface AuthResponse {
  user: User
  token: string
  refresh_token: string
}

export interface SessionResponse {
  user: User
  tokens: {
    access: TokenPair
    refresh: TokenPair
  }
}

export interface SessionIndexResponse {
  user: User
}

export interface User {
  readonly id: string
  email: string
  name: string
  role?: boolean
  avatar?: string
  level?: string
  token?: string
}
