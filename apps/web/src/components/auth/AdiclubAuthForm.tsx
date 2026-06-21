"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage, type FieldProps } from "formik"
import * as Yup from "yup"
import { Eye, EyeOff, X } from "lucide-react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import flashMessage from "@/components/shared/flashMessages"
import SocialLoginButtons from "@/app/(auth)/account-login/SocialLoginButtons"
import AuthTermsDisclaimer from "@/components/auth/AuthTermsDisclaimer"
import {
  emailValidationSchema,
  passwordValidationSchema,
} from "@/components/auth/adiclub-auth-schemas"
import { useCheckEmail } from "@/api/hooks/useCheckEmail"
import { useLoginMutationBetterAuthSessionSameSite } from "@/api/hooks/useLoginMutation"
import { useTranslations } from "@/hooks/useTranslations"
import { authClient } from "@/lib/auth-client"
import { fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import { cn } from "@/lib/utils"

type AuthStep = "email" | "login" | "register" | "activate"

type AdiclubAuthFormProps = {
  redirectTo?: string
  onSuccess?: () => void
  showForgotPasswordLink?: boolean
}

export default function AdiclubAuthForm({
  redirectTo = "/",
  onSuccess,
  showForgotPasswordLink = true,
}: AdiclubAuthFormProps) {
  const t = useTranslations("auth")
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const [step, setStep] = useState<AuthStep>("email")
  const [email, setEmail] = useState("")
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: checkEmail, isPending: isCheckingEmail } = useCheckEmail()
  const loginMutation = useLoginMutationBetterAuthSessionSameSite()

  const finishAuth = async () => {
    await dispatch(fetchUser())
    onSuccess?.()
    router.push(redirectTo)
  }

  const syncJwtSession = (rememberMe: boolean) =>
    new Promise<void>((resolve, reject) => {
      loginMutation.mutate(
        { keepLoggedIn: rememberMe },
        {
          onSuccess: async () => {
            await finishAuth()
            resolve()
          },
          onError: reject,
        },
      )
    })

  const handleEmailSubmit = async (values: { email: string }) => {
    setIsLoading(true)
    try {
      const response = await checkEmail(values.email)
      setEmail(values.email)

      if (response?.exists) {
        if (response.user?.activated === false) {
          setStep("activate")
        } else {
          setStep("login")
        }
      } else {
        setStep("register")
      }
    } catch {
      flashMessage(
        "error",
        t?.messages?.somethingWentWrong ?? "Something went wrong. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (password: string) => {
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: keepLoggedIn,
    })

    if (error) {
      flashMessage("error", t?.messages?.loginFailed ?? "Login failed")
      throw error
    }

    flashMessage("success", t?.messages?.loginSuccessful ?? "Login successful!")
    await syncJwtSession(keepLoggedIn)
  }

  const handleRegister = async (password: string) => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] ?? "Member",
      callbackURL: redirectTo,
    })

    if (error) {
      flashMessage("error", t?.messages?.failedToCreateAccount ?? "Failed to create account")
      throw error
    }

    flashMessage("success", t?.messages?.accountCreated ?? "Account created!")
    await syncJwtSession(keepLoggedIn)
  }

  if (step === "activate") {
    return (
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold uppercase">
          {t?.activateYourAccount ?? "ACTIVATE YOUR ACCOUNT"}
        </h2>
        <p className="text-base leading-relaxed">
          {t?.activateAccountMessage ??
            "Looks like you already have an account. We've sent you an email to activate it and get full access to adiClub benefits."}
        </p>
      </div>
    )
  }

  return (
    <>
      <SocialLoginButtons callbackURL={redirectTo} />

      {step === "email" && (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={emailValidationSchema(t)}
          onSubmit={handleEmailSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="adiclub-email" className="sr-only">
                  {t?.emailAddress ?? "EMAIL ADDRESS *"}
                </label>
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <div className="relative">
                      <Input
                        {...field}
                        id="adiclub-email"
                        type="email"
                        autoComplete="email"
                        placeholder={t?.emailAddress ?? "EMAIL ADDRESS *"}
                        aria-invalid={Boolean(errors.email && touched.email)}
                        className={cn(
                          "h-12 w-full px-3 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500",
                          errors.email && touched.email
                            ? "border-red-500 border-b-2 focus:border-red-500 focus:ring-red-500"
                            : values.email && !errors.email
                              ? "border-green-600 focus:border-green-600 focus:ring-green-600"
                              : "border-black focus:ring-black",
                        )}
                      />
                      {values.email && !errors.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <svg
                            className="h-5 w-5 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                      {errors.email && touched.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <X className="h-5 w-5 text-red-500" aria-hidden />
                        </div>
                      )}
                    </div>
                  )}
                </Field>
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              <div className="space-y-1">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onCheckedChange={(checked) => setKeepLoggedIn(!!checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="keepLoggedIn" className="text-sm leading-snug">
                    {t?.keepMeLoggedInShort ?? "Keep me logged in to all options."}
                  </label>
                </div>
                <button type="button" className="pl-6 text-sm underline">
                  {t?.moreInfo ?? "More info"}
                </button>
              </div>

              <Button
                border
                theme="black"
                showArrow
                pressEffect
                shadow
                loading={isCheckingEmail || isLoading}
                type="submit"
                className="h-12 w-full py-3 font-semibold uppercase"
              >
                {t?.continue ?? "CONTINUE"}
              </Button>

              <AuthTermsDisclaimer />
            </Form>
          )}
        </Formik>
      )}

      {step === "login" && (
        <Formik
          initialValues={{ password: "" }}
          validationSchema={Yup.object({ password: passwordValidationSchema(t) })}
          onSubmit={async (values) => {
            await handleLogin(values.password)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <p className="text-sm text-gray-600">
                {email}
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => setStep("email")}
                >
                  {t?.changeEmail ?? "Change"}
                </button>
              </p>

              <div>
                <label htmlFor="adiclub-password" className="sr-only">
                  {t?.password ?? "Password *"}
                </label>
                <div className="relative">
                  <Field name="password">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        id="adiclub-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder={t?.password ?? "Password *"}
                        className="h-12 w-full border-black px-3 pr-20 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500 focus:ring-black"
                      />
                    )}
                  </Field>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-xs uppercase"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="mr-1 inline-block h-4 w-4" /> {t?.hide ?? "HIDE"}
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 inline-block h-4 w-4" /> {t?.show ?? "SHOW"}
                      </>
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {showForgotPasswordLink && (
                <div className="text-sm">
                  {t?.forgotPassword ?? "Forgot your password?"}{" "}
                  <Link href="/password_resets/new" className="underline">
                    {t?.resetItHere ?? "Reset it here"}
                  </Link>
                </div>
              )}

              <Button
                border
                theme="black"
                showArrow
                pressEffect
                shadow
                loading={isSubmitting || loginMutation.isPending}
                type="submit"
                className="h-12 w-full py-3 font-semibold uppercase"
              >
                {isSubmitting ? (t?.loading ?? "LOADING...") : (t?.signIn ?? "SIGN IN")}
              </Button>
            </Form>
          )}
        </Formik>
      )}

      {step === "register" && (
        <Formik
          initialValues={{ password: "" }}
          validationSchema={Yup.object({ password: passwordValidationSchema(t) })}
          onSubmit={async (values) => {
            await handleRegister(values.password)
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <p className="text-sm text-gray-600">
                {email}
                <button
                  type="button"
                  className="ml-2 underline"
                  onClick={() => setStep("email")}
                >
                  {t?.changeEmail ?? "Change"}
                </button>
              </p>

              <div>
                <label htmlFor="adiclub-new-password" className="sr-only">
                  {t?.password ?? "Password *"}
                </label>
                <div className="relative">
                  <Field name="password">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        id="adiclub-new-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t?.password ?? "Password *"}
                        className="h-12 w-full border-black px-3 pr-20 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500 focus:ring-black"
                      />
                    )}
                  </Field>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-xs uppercase"
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="mr-1 inline-block h-4 w-4" /> {t?.hide ?? "HIDE"}
                      </>
                    ) : (
                      <>
                        <Eye className="mr-1 inline-block h-4 w-4" /> {t?.show ?? "SHOW"}
                      </>
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <Button
                border
                theme="black"
                showArrow
                pressEffect
                shadow
                loading={isSubmitting || loginMutation.isPending}
                type="submit"
                className="h-12 w-full py-3 font-semibold uppercase"
              >
                {isSubmitting
                  ? (t?.loading ?? "LOADING...")
                  : (t?.createPassword ?? "CREATE PASSWORD")}
              </Button>

              <AuthTermsDisclaimer />
            </Form>
          )}
        </Formik>
      )}
    </>
  )
}
