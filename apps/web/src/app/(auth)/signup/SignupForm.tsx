'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdiclubLogo from "@/components/auth/AdiclubLogo"
import AuthTermsDisclaimer from "@/components/auth/AuthTermsDisclaimer"
import SocialLoginButtons from "@/app/(auth)/account-login/SocialLoginButtons"
import { passwordValidationSchema } from "@/components/auth/adiclub-auth-schemas"
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch } from "react-redux"
import { useLoginMutationBetterAuthSessionSameSite } from "@/api/hooks/useLoginMutation"
import { useTranslations } from "@/hooks/useTranslations"
import { authClient } from "@/lib/auth-client"
import { fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import type { AuthTranslations } from "@/types/auth"
import { cn } from "@/lib/utils"

interface SignupFormValues {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const SignupSchema = (t: AuthTranslations) =>
  Yup.object().shape({
    name: Yup.string().required(t?.validation?.nameRequired || "Name is required"),
    email: Yup.string()
      .email(t?.validation?.emailInvalid || "Invalid email")
      .required(t?.validation?.emailRequired || "Please enter a value"),
    password: passwordValidationSchema(t),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref("password")], t?.validation?.passwordsMustMatch || "Passwords must match")
      .required(
        t?.validation?.passwordConfirmationRequired || "Password confirmation is required",
      ),
  })

function fieldInputClass(hasError: boolean, isValid: boolean) {
  return cn(
    "h-12 w-full px-3 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500",
    hasError
      ? "border-red-500 border-b-2 focus:border-red-500 focus:ring-red-500"
      : isValid
        ? "border-green-600 focus:border-green-600 focus:ring-green-600"
        : "border-black focus:ring-black",
  )
}

const SignupForm = () => {
  const t = useTranslations("auth")
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") ?? "/my-account"
  const dispatch = useDispatch<AppDispatch>()
  const loginMutation = useLoginMutationBetterAuthSessionSameSite()

  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false,
  })

  const togglePassword = (field: "password" | "password_confirmation") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const finishAuth = async () => {
    await dispatch(fetchUser())
    router.push(redirectTo)
  }

  const syncJwtSession = () =>
    new Promise<void>((resolve, reject) => {
      loginMutation.mutate(
        { keepLoggedIn: true },
        {
          onSuccess: async () => {
            await finishAuth()
            resolve()
          },
          onError: reject,
        },
      )
    })

  const handleSubmit = async (values: SignupFormValues) => {
    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
      callbackURL: redirectTo,
    })

    if (error) {
      flashMessage(
        "error",
        error.message || t?.messages?.failedToCreateAccount || "Failed to create account",
      )
      throw error
    }

    flashMessage("success", t?.messages?.accountCreated ?? "Account created!")
    await syncJwtSession()
  }

  return (
    <div className="w-full bg-white py-2 lg:py-10">
      <AdiclubLogo className="mb-8" />

      <h1 className="mb-2 text-[28px] font-bold uppercase leading-tight">
        {t?.signUp ?? "SIGN UP"}
      </h1>
      <p className="mb-6 text-base leading-relaxed">
        {t?.enjoyMembersOnly ??
          "Enjoy members-only access to exclusive products, experiences, offers and more."}
      </p>

      <SocialLoginButtons callbackURL={redirectTo} />

      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
        }}
        validationSchema={SignupSchema(t)}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="signup-name" className="sr-only">
                {t?.name ?? "NAME *"}
              </label>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      placeholder={t?.name ?? "NAME *"}
                      className={fieldInputClass(
                        Boolean(errors.name && touched.name),
                        Boolean(values.name && !errors.name),
                      )}
                    />
                    {values.name && !errors.name && (
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
                    {errors.name && touched.name && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="h-5 w-5 text-red-500" aria-hidden />
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
            </div>

            <div>
              <label htmlFor="signup-email" className="sr-only">
                {t?.emailAddress ?? "EMAIL ADDRESS *"}
              </label>
              <Field name="email">
                {({ field }: FieldProps) => (
                  <div className="relative">
                    <Input
                      {...field}
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      placeholder={t?.emailAddress ?? "EMAIL ADDRESS *"}
                      className={fieldInputClass(
                        Boolean(errors.email && touched.email),
                        Boolean(values.email && !errors.email),
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

            <div>
              <label htmlFor="signup-password" className="sr-only">
                {t?.password ?? "Password *"}
              </label>
              <div className="relative">
                <Field name="password">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword.password ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={t?.password ?? "Password *"}
                      className="h-12 w-full border-black px-3 pr-20 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500 focus:ring-black"
                    />
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => togglePassword("password")}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-xs uppercase"
                >
                  {showPassword.password ? (
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

            <div>
              <label htmlFor="signup-password-confirmation" className="sr-only">
                {t?.confirmPassword ?? "CONFIRM PASSWORD *"}
              </label>
              <div className="relative">
                <Field name="password_confirmation">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="signup-password-confirmation"
                      type={showPassword.password_confirmation ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder={t?.confirmPassword ?? "CONFIRM PASSWORD *"}
                      className="h-12 w-full border-black px-3 pr-20 placeholder:text-sm placeholder:font-normal placeholder:uppercase placeholder:tracking-wide placeholder:text-neutral-500 focus:ring-black"
                    />
                  )}
                </Field>
                <button
                  type="button"
                  onClick={() => togglePassword("password_confirmation")}
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-xs uppercase"
                >
                  {showPassword.password_confirmation ? (
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
                name="password_confirmation"
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
              {t?.createMyAccount ?? "CREATE MY ACCOUNT"}
            </Button>

            <div className="text-sm">
              {t?.alreadyHaveAccount ?? "Already have an account?"}{" "}
              <Link href="/account-login" className="underline">
                {t?.logIn ?? "LOG IN"}
              </Link>
            </div>

            <div className="text-sm">
              {t?.didntGetActivation ?? "Didn't get your activation email?"}{" "}
              <Link href="/account_activations/new" className="underline">
                {t?.resendActivation ?? "Resend activation"}
              </Link>
            </div>

            <AuthTermsDisclaimer />
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupForm
