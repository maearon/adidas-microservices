"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import Link from "next/link"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import { Button } from "@/components/ui/button"
import flashMessage from "@/components/shared/flashMessages"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { useCurrentUser } from "@/api/hooks/useCurrentUser"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const { data: user, isLoading, isError, isFetched } = useCurrentUser()

  const [errors, setErrors] = useState<ErrorMessageType>({})
  const [hasMounted, setHasMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (isFetched && user?.email) {
      setTimeout(() => router.replace("/my-account"), 0)
    }
  }, [isFetched, user, router])

  const handleSubmit = async (values: { email: string; password: string; rememberMe?: boolean }) => {
    setErrors({})
    loginMutation.mutate(values, {
      onSuccess: () => {
        flashMessage("success", "Login successful.")
        router.push("/")
      },
      onError: (error: any) => {
        if (error.code === "ERR_NETWORK") {
          flashMessage("error", "Cannot connect to the server. Please try again later.")
          return
        }
        const res = error.response?.data
        if (Array.isArray(res?.errors)) {
          const fieldErrors: ErrorMessageType = {}
          res.errors.forEach((err: any) => {
            const field = err?.cause?.field || "general"
            const message = err.defaultMessage || "Invalid input"
            if (!fieldErrors[field]) fieldErrors[field] = []
            fieldErrors[field].push(message)
          })
          setErrors(fieldErrors)
        } else if (res?.message) {
          setErrors({ general: [res.message] })
        } else {
          setErrors({ email: ["Incorrect email/password – please check and retry."] })
        }
      },
    })
  }

  if (!hasMounted || isLoading) return <FullScreenLoader />

  if (isError) {
    flashMessage("error", "Session expired or unauthorized. Please login again.")
  }

  if (user?.email) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">You're already logged in</h1>
          <Link href="/my-account" className="underline text-blue-600">
            Go to My Account
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left visual & benefits */}
            <div>
              <Image
                src="/placeholder.png"
                alt="Adiclub Benefits"
                width={600}
                height={600}
                className="w-full h-auto object-cover mb-6 rounded"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">JOIN ADICLUB TO UNLOCK MORE REWARDS</h2>
                <ul className="text-sm text-gray-700 space-y-1 mt-2">
                  <li>✓ Welcome Bonus Voucher for 15% off</li>
                  <li>✓ Free Shipping and Returns</li>
                  <li>✓ Members-Only Products</li>
                  <li>✓ Early Access to Sales</li>
                  <li>✓ Access to Limited Editions</li>
                </ul>
              </div>
            </div>

            {/* Login form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-xl font-bold mb-6">LOGIN TO ADICLUB</h1>

              <Formik
                initialValues={{ email: "", password: "", rememberMe: true }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="space-y-4">
                    {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="EMAIL *"
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="PASSWORD *"
                        className={
                          "w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black pr-12"
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 text-gray-600 text-xs"
                      >
                        {showPassword ? (
                          <>
                            <EyeOff className="inline-block w-4 h-4 mr-1" /> HIDE
                          </>
                        ) : (
                          <>
                            <Eye className="inline-block w-4 h-4 mr-1" /> SHOW
                          </>
                        )}
                      </button>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Field type="checkbox" name="rememberMe" checked={values.rememberMe} />
                      <label className="text-sm text-gray-600">Keep me logged in</label>
                    </div>

                    <Button
                      theme="black"
                      showArrow
                      pressEffect
                      shadow
                      loading={isSubmitting || loginMutation.isPending}
                      type="submit"
                      className="w-full py-3 font-semibold transition-colors"
                    >
                      SIGN IN
                    </Button>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                      Don’t have an account?{' '}
                      <Link href="/account-signup" className="underline text-blue-600">
                        Create one
                      </Link>
                    </div>

                    <div className="mt-2 text-sm text-center">
                      Forgot your password?{' '}
                      <Link href="/password_resets/new" className="underline text-blue-600" target="_blank">
                        Reset it here
                      </Link>
                    </div>

                    <div className="mt-6 text-xs text-gray-500 text-center">
                      By clicking 'Log In' you agree to our website's{' '}
                      <Link href="#" className="underline">Terms & Conditions</Link> and{' '}
                      <Link href="#" className="underline">Privacy Policy</Link>.
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
