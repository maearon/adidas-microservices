'use client'

import AdidasLogo from "@/components/adidas-logo"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ErrorMessage, Field, FieldProps, Form, Formik } from "formik"
import { Eye, EyeOff, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import * as Yup from "yup"
import ShowErrors, { normalizeFormikErrors, type ErrorMessages } from "@/components/shared/errorMessages"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import flashMessage from "@/components/shared/flashMessages"
import { useRouter } from "next/navigation"
import { handleApiError } from "@/components/shared/handleApiError"
import { AxiosError } from "axios"
import SocialLoginButtons from "./SocialLoginButtons"
import { Input } from "@/components/ui/input"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginForm = () => {
  const router = useRouter()
  const [errors, setErrors] = useState<ErrorMessages>({})
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLoginMutation()

  const handleSubmit = async (values: { email: string; password: string; keepLoggedIn: boolean }) => {
    setErrors({})
    setKeepLoggedIn(values.keepLoggedIn)

    const { email, password } = values

    loginMutation.mutate(
    {
      email,
      password,
      keepLoggedIn: keepLoggedIn
    },
    {
      onSuccess: () => {
        flashMessage("success", "Login successful.")
        router.push("/")
      },
      onError: (error: AxiosError<{ error?: string }>) => {
        const parsed = handleApiError(error)
        setErrors(parsed)
        if (parsed?.general?.[0]) flashMessage("error", parsed.general[0])
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

      <h1 className="text-2xl font-bold mb-2 scale-x-110 origin-left">LOG IN</h1>
      <p className="mb-4">Enjoy members-only access to exclusive products, experiences, offers and more.</p>

      <SocialLoginButtons />

      <Formik
        initialValues={{ email: "", password: "", keepLoggedIn: true }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className="space-y-4">
            {Object.keys(errors).length > 0 && <ShowErrors errorMessage={normalizeFormikErrors(errors)} />}

            <div>
              <Field name="email">
                {({ field }: FieldProps) => (
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
              <ErrorMessage name="email" component="div" className="text-red-500 text-base mt-1" />
            </div>

            <div className="relative">
              <Field name="password">
                {({ field }: FieldProps) => (
                  <Input {...field} type={showPassword ? "text" : "password"} placeholder="Password *" />
                )}
              </Field>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-600 dark:text-white text-xs"
              >
                {showPassword ? (
                  <><EyeOff className="inline-block w-4 h-4 mr-1" /> HIDE</>
                ) : (
                  <><Eye className="inline-block w-4 h-4 mr-1" /> SHOW</>
                )}
              </button>
              <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
            </div>

            {/* Keep me logged in */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="keepLoggedIn"
                checked={values.keepLoggedIn}
                onCheckedChange={(checked) => setFieldValue("keepLoggedIn", checked)}
              />
              <label htmlFor="keepLoggedIn" className="text-base">
                Keep me logged in. Applies to all options.{" "}
                <button type="button" className="underline">
                  More info
                </button>
              </label>
            </div>

            <Button
              border
              theme="black"
              showArrow
              pressEffect
              shadow
              loading={isSubmitting || loginMutation.isPending}
              type="submit"
              className="w-full py-3 font-semibold transition-colors"
            >
              CONTINUE
            </Button>

            <div className="mt-4 text-base text-gray-600 dark:text-white text-center">
              Don&apos;t have an account yet? <Link href="/signup" className="underline text-blue-600">Sign up</Link>
            </div>
            <div className="mt-2 text-base text-center">
              Forgot your password? <Link href="/password_resets/new" className="underline text-blue-600" >Reset it here</Link>
            </div>
            {/* Terms */}
            <div className="mt-6 text-xs text-gray-500">
              <p className="mb-2">Sign me up to adiClub, featuring exclusive adidas offers and news</p>
              <p>
                By clicking the &quot;Continue&quot; button, you are joining adiClub, will receive emails with the latest news and
                updates, and agree to the <button className="underline">TERMS OF USE</button> and{" "}
                <button className="underline">ADICLUB TERMS AND CONDITIONS</button> and acknowledge you have read the{" "}
                <button className="underline">ADIDAS PRIVACY POLICY</button>. If you are a California resident, the
                adiClub membership may be considered a financial incentive. Please see the Financial Incentives section of
                our <button className="underline">CALIFORNIA PRIVACY NOTICE</button> for details.
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default LoginForm
