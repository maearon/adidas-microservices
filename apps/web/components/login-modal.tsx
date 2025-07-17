"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { BaseButton } from "@/components/ui/base-button"
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Apple } from "lucide-react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { fetchUser } from "@/store/sessionSlice"
import flashMessage from "./shared/flashMessages"
import javaService from "@/api/services/javaService"
import { useCheckEmail } from "@/api/hooks/useCheckEmail"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import { useSignupMutation } from "@/api/hooks/useSignupMutation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const validationSchema = Yup.object({
  email: Yup.string().email("Please enter a valid e-mail address").required("Email is required"),
})

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"email" | "login" | "register"| "activate">("email")
  const [email, setEmail] = useState("") // lưu email sau bước 1
  const [keepLoggedIn, setKeepLoggedIn] = useState(true) // lưu keepLoggedIn sau bước 1
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<"apple" | "facebook" | "google" | "yahoo" | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  }
  const {
    mutateAsync: checkEmail, 
    isPending 
  } = useCheckEmail()
  const {
    mutateAsync: loginMutation,
    isPending: isLoggingIn
  } = useLoginMutation()
  // const { mutateAsync: register, isPending: isRegistering } = useRegister()
  const {
    mutateAsync: signupMutation,
    isPending: isRegistering
  } = useSignupMutation()

  useEffect(() => {
    if (isOpen) {
      setStep("email")
    }
  }, [isOpen])

  const handleEmailSubmit = async (values: { email: string; keepLoggedIn: boolean }) => {
    setIsLoading(true)
    try {
      const response = await checkEmail(values.email)

      setEmail(values.email)
      setKeepLoggedIn(values.keepLoggedIn)
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
      flashMessage("error", "Something went wrong. Please try again.")
    }
  }

  const handleLogin = async (password: string) => {
    try {
      const res = await loginMutation({ email, password, keepLoggedIn })
      if (res) {
        await dispatch(fetchUser())
        flashMessage("success", "Login successful!")
        onClose()
      } else {
        flashMessage("error", "Invalid password")
      }
    } catch (err) {
      flashMessage("error", "Login failed")
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
      const name = email.split("@")[0]
      const res = await signupMutation(payload)
      if (res?.success) {
        // flashMessage("success", "Account created!")
        // await dispatch(fetchUser())
        // onClose()
      } else {
        flashMessage("error", "Failed to create account")
      }
    } catch (err) {
      flashMessage("error", "Something went wrong")
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

  const handleSocialLogin = (
    provider: "apple" | "facebook" | "google" | "yahoo",
    callback?: () => void,
    delay: number = 3000
  ) => {
    setSocialLoading(provider)
    setTimeout(() => {
      setSocialLoading(null)
      callback?.()
    }, delay)
  }


  return step !== "activate" ? (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] sm:max-w-md max-h-[95vh] overflow-y-auto bg-white p-0 rounded-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-51"
        >
          {/* <X className="w-5 h-5" /> */}
        </button>

        <div className="p-6 sm:p-8">
          {/* adiClub Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center">
              <span className="text-2xl font-bold">adi</span>
              <span className="text-2xl font-bold text-blue-600 italic">club</span>
              <div className="ml-2 w-12 h-6 border-2 border-blue-600 rounded-full relative">
                <div className="absolute inset-0 border-2 border-blue-600 rounded-full transform rotate-12"></div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">YOUR ADICLUB BENEFITS AWAIT</h2>
            <p className="text-gray-600 text-sm">
              Get free shipping, discount vouchers and members only products when you're in adiClub.
            </p>
          </div>

          {/* Social Login Text */}
          <p className="text-center text-sm font-medium mb-4">Log in or sign up (it's free)</p>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <LoadingButton 
              variant="outline" size="sm" 
              className="p-3 h-12" 
              onClick={() => handleSocialLogin("apple", () => console.log("apple"))}
              loading={socialLoading === "apple"}
            >
              <Apple className="h-5 w-5" />
            </LoadingButton>
            <LoadingButton 
              variant="outline" size="sm" 
              className="p-3 h-12" 
              onClick={() => handleSocialLogin("facebook", () => console.log("facebook"))}
              loading={socialLoading === "facebook"}
            >
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </LoadingButton>
            <LoadingButton 
              variant="outline" 
              size="sm" 
              className="p-3 h-12" 
              onClick={() => handleSocialLogin("google", () => console.log("google"))}
              loading={socialLoading === "google"}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </LoadingButton>
            <LoadingButton 
              variant="outline" 
              size="sm" 
              className="p-3 h-12" 
              onClick={() => handleSocialLogin("yahoo", () => console.log("yahoo"))}
              loading={socialLoading === "yahoo"}
            >
              <span className="text-purple-600 font-bold text-lg">Y!</span>
            </LoadingButton>
          </div>
          
          {/* Email Form */}
          {step === "email" && (
            <Formik
              initialValues={{ email: "", keepLoggedIn: false }}
              validationSchema={validationSchema}
              onSubmit={handleEmailSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form className="space-y-4">
                  <div>
                    <Field name="email">
                      {({ field }: any) => (
                        <div className="relative">
                          <Input
                            {...field}
                            type="email"
                            placeholder="EMAIL ADDRESS *"
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
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Keep me logged in */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="keepLoggedIn"
                      checked={values.keepLoggedIn}
                      onCheckedChange={(checked) => setFieldValue("keepLoggedIn", checked)}
                    />
                    <label htmlFor="keepLoggedIn" className="text-sm">
                      Keep me logged in. Applies to all options.{" "}
                      <button type="button" className="underline">
                        More info
                      </button>
                    </label>
                  </div>

                  {/* Continue Button */}
                  <Button
                    theme={"black"}
                    shadow={true}
                    pressEffect={true}
                    type="submit"
                    fullWidth={true}
                    loading={isPending}
                  >
                    {isPending ? "LOADING..." : "CONTINUE"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Password Form */}
          {step === "login" && (
            <Formik
              initialValues={{ password: "" }}
              onSubmit={async (values) => {
                await handleLogin(values.password)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <Field name="password">
                    {({ field }: any) => (
                      <Input {...field} type="password" placeholder="Password *" />
                    )}
                  </Field>
                  <Button
                    type="submit"
                    loading={isLoggingIn || isSubmitting}
                    className="w-full bg-black text-white py-3"
                  >
                    {isLoggingIn ? "LOADING..." : "SIGN IN"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {step === "register" && (
            <Formik
              initialValues={{ password: "" }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .required("Required")
                  .min(8, "Min 8 characters")
                  .matches(/[A-Z]/, "1 uppercase")
                  .matches(/[a-z]/, "1 lowercase")
                  .matches(/[0-9]/, "1 number")
                  .matches(/[@$!%*?&#]/, "1 special character"),
              })}
              onSubmit={async (values) => {
                await handleRegister(values.password)
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <Field name="password">
                    {({ field }: any) => (
                      <Input {...field} type="password" placeholder="Create Password *" />
                    )}
                  </Field>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800 py-3"
                    loading={isRegistering}
                  >
                    {isRegistering ? "LOADING..." : "CREATE PASSWORD"}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Terms */}
          <div className="mt-6 text-xs text-gray-500">
            <p className="mb-2">Sign me up to adiClub, featuring exclusive adidas offers and news</p>
            <p>
              By clicking the "Continue" button, you are joining adiClub, will receive emails with the latest news and
              updates, and agree to the <button className="underline">TERMS OF USE</button> and{" "}
              <button className="underline">ADICLUB TERMS AND CONDITIONS</button> and acknowledge you have read the{" "}
              <button className="underline">ADIDAS PRIVACY POLICY</button>. If you are a California resident, the
              adiClub membership may be considered a financial incentive. Please see the Financial Incentives section of
              our <button className="underline">CALIFORNIA PRIVACY NOTICE</button> for details.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-md max-h-[95vh] overflow-y-auto bg-white p-0 rounded-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black z-51"
        >
          {/* <X className="w-5 h-5" /> */}
        </button>

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
            <h2 className="text-xl font-bold mb-2">ACTIVATE YOUR ACCOUNT</h2>
            <p className="text-gray-600 text-sm">
              Looks like you already have an account. We’ve sent you an email to activate it and get full access to adiClub benefits.
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
