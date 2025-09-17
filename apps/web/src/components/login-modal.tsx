"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, X } from "lucide-react"
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
// import { fetchUser } from "@/store/sessionSlice"
import flashMessage from "./shared/flashMessages"
import { useCheckEmail } from "@/api/hooks/useCheckEmail"
// import { useLoginMutation } from "@/api/hooks/useLoginMutation"
// import { SignupResponse, useSignupMutation } from "@/api/hooks/useSignupMutation"
import AdidasLogo from "./adidas-logo"
import SocialLoginButtons from "@/app/(auth)/account-login/SocialLoginButtons"
import { useTranslations } from "@/hooks/useTranslations"
import { AuthTranslations } from "@/types/auth"
import { authClient } from "@/lib/auth-client"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const validationSchema = (t: AuthTranslations) => Yup.object({
  email: Yup.string().email(t?.validation?.emailInvalid || "Please enter a valid e-mail address")
  .required(t?.validation?.emailRequired || "Email is required"),
})

const passwordSchema = (t: AuthTranslations) =>
  Yup.string()
    .required(t?.validation?.required || "Required")
    .min(8, t?.validation?.min8Characters || "Min 8 characters")
    .matches(/[A-Z]/, t?.validation?.oneUppercase || "1 uppercase")
    .matches(/[a-z]/, t?.validation?.oneLowercase || "1 lowercase")
    .matches(/[0-9]/, t?.validation?.oneNumber || "1 number")
    .matches(/[@$!%*?&#]/, t?.validation?.oneSpecialCharacter || "1 special character")

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations("auth");
  const [step, setStep] = useState<"email" | "login" | "register"| "activate">("email")
  const [email, setEmail] = useState("") // lưu email sau bước 1
  const [keepLoggedIn, setKeepLoggedIn] = useState(true) // lưu keepLoggedIn sau bước 1
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  // if (typeof window !== "undefined") {
  //   const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  // }
  const [showPassword, setShowPassword] = useState(false)
  const {
    mutateAsync: checkEmail, 
    isPending 
  } = useCheckEmail()
  // const {
  //   mutateAsync: loginMutation,
  //   isPending: isLoggingIn
  // } = useLoginMutation()
  // const { mutateAsync: register, isPending: isRegistering } = useRegister()
  // const {
  //   mutateAsync: signupMutation,
  //   isPending: isRegistering
  // } = useSignupMutation<SignupResponse>();

  useEffect(() => {
    if (isOpen) {
      setStep("email")
    }
  }, [isOpen])

  const handleEmailSubmit = async (values: { email: string }) => {
    setIsLoading(true)
    try {
      const response = await checkEmail(values.email)

      setEmail(values.email)
      setKeepLoggedIn(keepLoggedIn)
      if (response?.exists) {
        if (response.user?.activated === false) {
          setStep("activate")
        } else {
          setStep("login")
        }
      } else {
        setStep("register")
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log('error', error)
      flashMessage("error", t?.messages?.somethingWentWrong || "Something went wrong. Please try again.")
    }
  }

  const handleLogin = async (password: string) => {
    try {
      // const res = await loginMutation({ email, password, keepLoggedIn })
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: keepLoggedIn,
        callbackURL: "/",
      });
      // if (res) {
      //   await dispatch(fetchUser())
      //   flashMessage("success", t?.messages?.loginSuccessful || "Login successful!")
      //   onClose()
      // } else {
      //   flashMessage("error", t?.messages?.invalidPassword || "Invalid password")
      // }
      if (error) {
        flashMessage("error", t?.messages?.loginFailed || "Login failed")
      } else {
        flashMessage("success", t?.messages?.loginSuccessful || "Login successful!")
      }
    } catch (err) {
      flashMessage("error", t?.messages?.loginFailed || "Login failed")
      throw err
    }
  }

  const handleRegister = async (password: string) => {
    const payload = {
      user: {
        name: email.split("@")[0],
        email: email,
        password: password,
        password_confirmation: password
      }
    }
    try {
      // const res = await signupMutation(payload)
      const { error } = await authClient.signUp.email({
        email: payload.user.email,
        password,
        name: payload.user.name,
        callbackURL: "/my-account",
      });

      if (error) {
        flashMessage("error", t?.messages?.failedToCreateAccount || "Failed to create account")
      } else {
        flashMessage("success", "Account created!")
        // toast.success("Signed up successfully");
        // router.push("/my-account");
      }
      // if (res?.success) {
      //   flashMessage("success", "Account created!")
      //   await dispatch(fetchUser())
      //   onClose()
      // } else {
      //   flashMessage("error", t?.messages?.failedToCreateAccount || "Failed to create account")
      // }
    } catch (err) {
      flashMessage("error", t?.messages?.somethingWentWrong || "Something went wrong")
      throw err
    }
  }

  // const handleSocialLogin = (provider: string) => {
  //   console.log(`Login with ${provider}`)
  //   setIsLoading(true)
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 5000) // 5s

  //   if (callback) callback()
  //   }

  //   return { handleSocialLogin }
  // }

  

  return step !== "activate" ? (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[95vw] sm:max-w-md max-h-[95vh] overflow: visible bg-white dark:bg-black p-0 rounded-none"
      >
        <DialogHeader><DialogTitle></DialogTitle></DialogHeader>
        {/* Close button - Square border style */}
        <div className="absolute bg-white dark:bg-black border border-black dark:border-white z-52 right-0 transform translate-x-[30%] translate-y-[-30%]">
          <button
            onClick={onClose}
            className="w-12 h-12 border border-border flex items-center 
            justify-center cursor-pointer transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* adiClub Logo */}
          <div className="flex items-center space-x-4">
          <AdidasLogo className="w-15 h-auto" />
          <div className="w-px h-6 bg-gray-300" />
          <div className="text-center">
            <div className="inline-flex justify-center">
              <span className="text-2xl font-bold">adi</span>
              <span className="text-2xl font-bold text-blue-600 italic">club</span>
              <div className="ml-2 w-12 h-6 border-2 border-blue-600 rounded-full relative">
                <div className="absolute inset-0 border-2 border-blue-600 rounded-full transform rotate-12"></div>
              </div>
            </div>
          </div>
          </div>

          {/* Title */}
          {/* <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">YOUR ADICLUB BENEFITS AWAIT</h2>
            <p className="text-gray-600 dark:text-white text-base">
              Enjoy members-only access to exclusive products, experiences, offers and more.
            </p>
          </div> */}

          {/* Social Login Text */}
          <h1 className="text-2xl font-bold mb-2 scale-x-110 origin-left">{t?.logInOrSignUp || "LOG IN OR SIGN UP"}</h1>
          <p className="mb-4">{t?.enjoyMembersOnly || "Enjoy members-only access to exclusive products, experiences, offers and more."}</p>
          {/* <p className="text-background text-base">
            Enjoy members-only access to exclusive products, experiences, offers and more.
          </p> */}

          {/* Social Login Buttons */}
          <SocialLoginButtons />
          
          {/* <div className="grid grid-cols-1 gap-3 mb-6">
            <GoogleSignInButton />
            <GithubSignInButton />
            <LoginButtons />
          </div> */}
          
          {/* Email Form */}
          {step === "email" && (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={validationSchema(t)}
              onSubmit={handleEmailSubmit}
            >
              {({ values, errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <Field name="email">
                      {({ field }: FieldProps) => (
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder={t?.emailAddress || "EMAIL ADDRESS *"}
                            className={`w-full ${
                              errors.email && touched.email
                                ? "border-red-500 focus:border-red-500"
                                : values.email && !errors.email
                                  ? "border-green-500 focus:border-green-500"
                                  : ""
                            }`}
                          />
                          {values.email && !errors.email && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          {errors.email && touched.email && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <X className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-base mt-1" />
                  </div>

                  {/* Keep me logged in */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keepLoggedIn"
                      checked={keepLoggedIn}
                      onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
                    />
                    <label htmlFor="keepLoggedIn" className="text-base">
                      {t?.keepMeLoggedIn || "Keep me logged in. Applies to all options."}{" "}
                      <button type="button" className="underline">
                        {t?.moreInfo || "More info"}
                      </button>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <Button
                    border
                    theme="black"
                    showArrow
                    pressEffect
                    shadow
                    loading={isPending || isLoading}
                    type="submit"
                    className="w-full py-3 font-semibold transition-colors"
                  >
                    {t?.continue || "CONTINUE"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Password Form */}
          {step === "login" && (
            <Formik
              initialValues={{ password: "" }}
              validationSchema={Yup.object({ password: passwordSchema(t) })}
              onSubmit={async (values) => {
                await handleLogin(values.password)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="relative">
                    <Field name="password">
                      {({ field }: FieldProps) => (
                        <Input {...field}  type={showPassword ? "text" : "password"} placeholder={t?.password || "Password *"} />
                      )}
                    </Field>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-3 text-gray-600 dark:text-white text-xs"
                    >
                      {showPassword ? (
                        <><EyeOff className="inline-block w-4 h-4 mr-1" /> {t?.hide || "HIDE"}</>
                      ) : (
                        <><Eye className="inline-block w-4 h-4 mr-1" /> {t?.show || "SHOW"}</>
                      )}
                    </button>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
                  </div>
                  <Button
                    border
                    theme="black"
                    showArrow
                    pressEffect
                    shadow
                    loading={isSubmitting}
                    type="submit"
                    className="w-full py-3 font-semibold transition-colors"
                  >
                    {isSubmitting ? (t?.loading || "LOADING...") : (t?.signIn || "SIGN IN")}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {step === "register" && (
            <Formik
              initialValues={{ password: "" }}       
              validationSchema={Yup.object({ password: passwordSchema(t) })}
              onSubmit={async (values) => {
                await handleRegister(values.password)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="relative">
                    <Field name="password">
                      {({ field }: FieldProps) => (
                        <Input {...field}  type={showPassword ? "text" : "password"} placeholder={t?.password || "Password *"} />
                      )}
                    </Field>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-3 text-gray-600 dark:text-white text-xs"
                    >
                      {showPassword ? (
                        <><EyeOff className="inline-block w-4 h-4 mr-1" /> {t?.hide || "HIDE"}</>
                      ) : (
                        <><Eye className="inline-block w-4 h-4 mr-1" /> {t?.show || "SHOW"}</>
                      )}
                    </button>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
                  </div>
                  <Button
                    border
                    theme="black"
                    showArrow
                    pressEffect
                    shadow
                    loading={isSubmitting}
                    type="submit"
                    className="w-full py-3 font-semibold transition-colors"
                  >
                    {isSubmitting ? (t?.loading || "LOADING...") : (t?.createPassword || "CREATE PASSWORD")}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Terms */}
          <div className="mt-6 text-xs text-gray-500">
            <p className="mb-2">{t?.signMeUpToAdiclub || "Sign me up to adiClub, featuring exclusive adidas offers and news"}</p>
            <p>
              {t?.termsText || "By clicking the \"Continue\" button, you are joining adiClub, will receive emails with the latest news and updates, and agree to the"} <button className="underline">{t?.termsOfUse || "TERMS OF USE"}</button> {t?.and || "and"}{" "}
              <button className="underline">{t?.adiclubTerms || "ADICLUB TERMS AND CONDITIONS"}</button> {t?.acknowledgeRead || "and acknowledge you have read the"}{" "}
              <button className="underline">{t?.adidasPrivacyPolicy || "ADIDAS PRIVACY POLICY"}</button>{t?.californiaResident || ". If you are a California resident, the adiClub membership may be considered a financial incentive. Please see the Financial Incentives section of our"} <button className="underline">{t?.californiaPrivacyNotice || "CALIFORNIA PRIVACY NOTICE"}</button> {t?.forDetails || "for details."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[95vh] overflow-y-auto bg-white dark:bg-black p-0 rounded-none">
        <DialogHeader><DialogTitle>{""}</DialogTitle></DialogHeader>
        {/* Close button - Square border style */}
        <div className="absolute bg-white dark:bg-black z-52 right-0 transform translate-x-[30%] translate-y-[-30%]">
          <button
            onClick={onClose}
            className="w-12 h-12 border border-border flex items-center 
            justify-center cursor-pointer transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "activate" ? (
          <div className="p-6 sm:p-8 text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">adi</span>
              <span className="text-2xl font-bold text-blue-600 italic">club</span>
              <div className="ml-2 w-12 h-6 border-2 border-blue-600 rounded-full relative">
                <div className="absolute inset-0 border-2 border-blue-600 rounded-full transform rotate-12"></div>
              </div>
            </div>

            {/* Title + Content */}
            <h2 className="text-xl font-bold mb-2">{t?.activateYourAccount || "ACTIVATE YOUR ACCOUNT"}</h2>
            <p className="text-foreground text-base">
              {t?.activateAccountMessage || "Looks like you already have an account. We've sent you an email to activate it and get full access to adiClub benefits."}
            </p>
          </div>
        ) : (
          // Các bước cũ (email, login, register) giữ nguyên
          <div className="p-6 sm:p-8">
            {/* ... như bạn đang có */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
