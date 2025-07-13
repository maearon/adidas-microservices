"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import Link from "next/link"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import { Button } from "@/components/ui/button"
import { handleNetworkError } from "@/components/shared/handleNetworkError"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const [errors, setErrors] = useState<ErrorMessageType>({})

  const handleSubmit = async (values: any) => {
    setErrors({})

    loginMutation.mutate(
      {
        email: values.email,
        password: values.password,
        remember_me: values.rememberMe === "1",
      },
      {
        onSuccess: (response) => {
          if (response?.user) {
            flashMessage("success", "Logged in successfully.")
            router.push("/")
          }
        },
        onError: (error: any) => {
          handleNetworkError(error)
          const res = error.response?.data
          if (res?.error) {
            setErrors({ email: [res.error] })
          } else if (res?.message) {
            setErrors({ general: [res.message] })
          } else {
            flashMessage("error", "Login failed. Please try again.")
          }
        },
      }
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
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">a</span>
                  </div>
                  <h2 className="text-2xl font-bold">LOG IN TO YOUR ADICLUB</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Sign in to unlock your adiClub benefits, access your order history, track your orders, and more.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 15% welcome voucher</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Free shipping</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Member-only promotions</li>
                </ul>
              </div>
            </div>

            {/* Login form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-xl font-bold mb-6 text-center">LOG IN TO CONTINUE</h1>

              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  rememberMe: "1",
                }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="EMAIL ADDRESS *"
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

                    <div className="flex items-center mb-4">
                      <Field type="checkbox" name="rememberMe" value="1" className="mr-2" />
                      <label className="text-sm text-gray-700">
                        Keep me logged in.
                      </label>
                    </div>

                    <Button
                      type="submit"
                      loading={isSubmitting || loginMutation.isPending}
                      className="w-full py-3 font-semibold transition-transform shadow-md hover:shadow-xl hover:scale-[1.01] focus:ring-2 focus:ring-black rounded-md bg-black text-white"
                    >
                      CONTINUE
                    </Button>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                      New to adiClub?{" "}
                      <Link href="/signup" className="underline text-blue-600">
                        Create account
                      </Link>
                    </div>

                    <div className="mt-2 text-sm text-center">
                      Forgot your password?{" "}
                      <Link
                        href="/password_resets/new"
                        className="underline text-blue-600"
                      >
                        Reset here
                      </Link>
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
