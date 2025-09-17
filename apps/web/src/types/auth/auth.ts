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

// types/translations.ts
export interface AuthTranslations {
  logInOrSignUp: string;
  logIn: string;
  signUp: string;
  enjoyMembersOnly: string;
  emailAddress: string;
  password: string;
  name: string;
  confirmPassword: string;
  keepMeLoggedIn: string;
  moreInfo: string;
  continue: string;
  signIn: string;
  createPassword: string;
  createMyAccount: string;
  loading: string;
  show: string;
  hide: string;
  activateYourAccount: string;
  activateAccountMessage: string;
  alreadyLoggedIn: string;
  goToMyAccount: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  forgotPassword: string;
  resetItHere: string;
  didntGetActivation: string;
  resendActivation: string;
  signMeUpToAdiclub: string;
  termsText: string;
  termsOfUse: string;
  and: string;
  adiclubTerms: string;
  acknowledgeRead: string;
  adidasPrivacyPolicy: string;
  californiaResident: string;
  californiaPrivacyNotice: string;
  forDetails: string;
  joinAdiclubToUnlock: string;
  joinAdiclubForFree: string;
  welcomeBonusVoucher: string;
  freeShippingReturns: string;
  membersOnlyProducts: string;
  earlyAccessSales: string;
  accessLimitedEditions: string;
  startEarningPoints: string;
  joinAdiclubGetDiscount: string;
  asAdiclubMember: string;
  freeShipping: string;
  fifteenPercentVoucher: string;
  membersOnlySales: string;
  accessAdidasApps: string;
  specialPromotions: string;

  validation: {
    emailRequired: string;
    emailInvalid: string;
    passwordRequired: string;
    nameRequired: string;
    passwordMinLength: string;
    passwordConfirmationRequired: string;
    passwordsMustMatch: string;
    required: string;
    min8Characters: string;
    oneUppercase: string;
    oneLowercase: string;
    oneNumber: string;
    oneSpecialCharacter: string;
  };

  messages: {
    loginSuccessful: string;
    loginFailed: string;
    invalidPassword: string;
    accountCreated: string;
    failedToCreateAccount: string;
    somethingWentWrong: string;
    signupSuccessful: string;
    somethingWentWrongSignup: string;
    cannotConnectServer: string;
    invalidInput: string;
  };
}
