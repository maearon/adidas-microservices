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

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const [errors, setErrors] = useState<ErrorMessageType>({})
  const { data: user, isLoading, isError, isFetched } = useCurrentUser()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (isFetched && user?.email) {
      setTimeout(() => {
        router.replace("/my-account")
      }, 0)
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
        setErrors({ email: ["or password incorrect"] })
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
      <div className="relative bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left info box */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">a</span>
                  </div>
                  <h2 className="text-2xl font-bold">JOIN ADICLUB. GET A 15% DISCOUNT.</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  As an adiClub member you get rewarded with what you love for doing what you love. Sign in now and enjoy:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Free shipping</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> A 15% off voucher</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Members Only sales</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Access to adidas apps</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Special promotions</li>
                </ul>
              </div>
            </div>

            {/* Login form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-xl font-bold mb-6 text-center">SIGN IN TO YOUR ACCOUNT</h1>

              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  rememberMe: true,
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values }) => (
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

                    <div>
                      <Field
                        name="password"
                        type="password"
                        placeholder="PASSWORD *"
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Field type="checkbox" name="rememberMe" checked={values.rememberMe} />
                      <label className="text-sm text-gray-600">
                        Keep me logged in
                      </label>
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
                      Don’t have an account?{" "}
                      <Link href="/account-signup" className="underline text-blue-600">
                        Create one
                      </Link>
                    </div>

                    <div className="mt-2 text-sm text-center">
                      Forgot your password?{" "}
                      <Link
                        href="/password_resets/new"
                        className="underline text-blue-600"
                        target="_blank"
                      >
                        Reset it here
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-2">By logging in, you accept the <Link href="#" className="underline">TERMS OF USE</Link> and <Link href="#" className="underline">PRIVACY POLICY</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
