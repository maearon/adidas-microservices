'use client'

import AdidasLogo from "@/components/adidas-logo"
import { Button } from "@/components/ui/button"
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import * as Yup from "yup"
import ShowErrors, { normalizeFormikErrors, type ErrorMessages } from "@/components/shared/errorMessages"
import flashMessage from "@/components/shared/flashMessages"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"
import { SignupResponse, useSignupMutation } from "@/api/hooks/useSignupMutation"
import { NetworkErrorWithCode } from "@/components/shared/handleNetworkError"
import { Input } from "@/components/ui/input"
import { useTranslations } from "@/hooks/useTranslations"
import { AuthTranslations } from "@/types/auth"

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ValidationErrorItem {
  cause?: { field?: string };
  defaultMessage?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: ValidationErrorItem[];
}

const SignupSchema = (t: AuthTranslations) => Yup.object().shape({
  name: Yup.string().required(t?.validation?.nameRequired || "Name is required"),
  email: Yup.string().email(t?.validation?.emailInvalid || "Invalid email").required(t?.validation?.emailRequired || "Email is required"),
  password: Yup.string().min(6, t?.validation?.passwordMinLength || "Password must be at least 6 characters").required(t?.validation?.passwordRequired || "Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], t?.validation?.passwordsMustMatch || "Passwords must match")
    .required(t?.validation?.passwordConfirmationRequired || "Password confirmation is required"),
})

const SignupForm = () => {
  const t = useTranslations("auth");
  const router = useRouter()
  const [errors, setErrors] = useState<ErrorMessages>({})
  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false,
  });
  const signupMutation = useSignupMutation<SignupResponse>();

  const togglePassword = (field: "password" | "password_confirmation") => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (values: SignupFormValues) => {
    setErrors({})

    const payload = {
      user: {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
    }

    signupMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response?.success) {
          flashMessage("success", response.message || t?.messages?.signupSuccessful || "Signup successful.")
          router.push("/account-login")
          return
        }
        if (response?.errors) {
          setErrors(response.errors)
        }
      },

      onError: (error) => {
        // Trường hợp lỗi mạng
        const netErr = error as NetworkErrorWithCode
        if (netErr.code === "ERR_NETWORK") {
          flashMessage("error", t?.messages?.cannotConnectServer || "Cannot connect to the server. Please try again later.")
          return
        }

        // Trường hợp lỗi từ API
        const axiosErr = error as AxiosError<ApiErrorResponse>;
        const resData = axiosErr.response?.data

        if (Array.isArray(resData?.errors)) {
          const fieldErrors: ErrorMessages = {}
          resData.errors.forEach((err) => {
            const field = err?.cause?.field || "general"
            const message = err.defaultMessage || t?.messages?.invalidInput || "Invalid input"
            if (!fieldErrors[field]) fieldErrors[field] = []
            fieldErrors[field].push(message)
          })
          setErrors(fieldErrors)
        } else if (resData?.message) {
          setErrors({ general: [resData.message] })
        } else {
          flashMessage("error", t?.messages?.somethingWentWrongSignup || "Something went wrong during signup.")
        }
      },
    })
  }

  return (
    <div className="bg-background md:p-8 p-1 rounded-none">
      <div className="flex items-center space-x-4">
      {/* adiClub Logo */}
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
      
      {/* Social Login Text */}
      <h1 className="text-2xl font-bold mb-2 scale-x-110 origin-left">{t?.signUp || "SIGN UP"}</h1>
      <p className="mb-4">{t?.enjoyMembersOnly || "Enjoy members-only access to exclusive products, experiences, offers and more."}</p>

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
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className="space-y-4">
            {Object.keys(errors).length > 0 && <ShowErrors errorMessage={normalizeFormikErrors(errors)} />}

            <div>
              <Field name="name">
                {({ field }: FieldProps) => (
                  <div className="relative">
                    <Input
                      {...field}
                      type="name"
                      placeholder={t?.name || "NAME *"}
                      className={`w-full ${
                        errors.name && touched.name
                          ? "border-red-500 focus:border-red-500"
                          : values.name && !errors.name
                            ? "border-green-500 focus:border-green-500"
                            : ""
                      }`}
                    />
                    {values.name && !errors.name && (
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
                    {errors.name && touched.name && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage name="name" component="div" className="text-red-500 text-base mt-1" />
            </div>

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

            {/* <div>
              <Field
                name="password"
                type="password"
                placeholder="PASSWORD *"
                className="w-full border border-border p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
            </div> */}

            <div className="relative">
              <Field name="password">
                {({ field }: FieldProps) => (
                  <Input {...field} type={showPassword.password ? "text" : "password"} placeholder={t?.password || "PASSWORD *"} />
                )}
              </Field>
              <button
                type="button"
                onClick={() => togglePassword("password")}
                className="absolute top-3 right-3 text-gray-600 dark:text-white text-xs"
              >
                {showPassword.password ? (
                  <><EyeOff className="inline-block w-4 h-4 mr-1" /> {t?.hide || "HIDE"}</>
                ) : (
                  <><Eye className="inline-block w-4 h-4 mr-1" /> {t?.show || "SHOW"}</>
                )}
              </button>
              <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
            </div>

            {/* <div>
              <Field
                name="password_confirmation"
                type="password"
                placeholder="CONFIRM PASSWORD *"
                className="w-full border border-border p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
              />
              <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-base mt-1" />
            </div> */}
            <div className="relative">
              <Field name="password_confirmation">
                {({ field }: FieldProps) => (
                  <Input {...field} type={showPassword.password_confirmation ? "text" : "password"} placeholder={t?.confirmPassword || "CONFIRM PASSWORD *"} />
                )}
              </Field>
              <button
                type="button"
                onClick={() => togglePassword("password_confirmation")}
                className="absolute top-3 right-3 text-gray-600 dark:text-white text-xs"
              >
                {showPassword.password_confirmation ? (
                  <><EyeOff className="inline-block w-4 h-4 mr-1" /> {t?.hide || "HIDE"}</>
                ) : (
                  <><Eye className="inline-block w-4 h-4 mr-1" /> {t?.show || "SHOW"}</>
                )}
              </button>
              <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-base mt-1" />
            </div>

            <Button
              border
              theme="black"
              showArrow
              pressEffect
              shadow
              loading={isSubmitting || signupMutation.isPending}
              type="submit"
              className="w-full py-3 font-semibold transition-colors"
            >
{t?.createMyAccount || "CREATE MY ACCOUNT"}
            </Button>

            <div className="mt-4 text-base text-gray-600 dark:text-white text-center">
              {t?.alreadyHaveAccount || "Already have an account?"}{" "}
              <Link href="/account-login" className="underline text-blue-600">
                {t?.logIn || "Log in"}
              </Link>
            </div>

            <div className="mt-2 text-base text-center">
              {t?.didntGetActivation || "Didn't get your activation email?"}{" "}
              <Link
                href="/account_activations/new"
                className="underline text-blue-600"
                
              >
                {t?.resendActivation || "Resend activation"}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupForm
