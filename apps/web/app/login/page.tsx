"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import { handleApiError } from "@/components/shared/handleApiError"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const [errors, setErrors] = useState<ErrorMessageType>({})

  const handleSubmit = async (values: { email: string; password: string }) => {
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
        setErrors(handleApiError(error))
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
          flashMessage("error", "Something went wrong during login.")
        }
      },
    })
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
                  <h2 className="text-2xl font-bold">WELCOME BACK TO ADICLUB</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Log in to access exclusive member benefits:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Track your orders</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Access your wishlist</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Get exclusive offers</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Fast checkout</li>
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

                    <Button
                      theme={"black"}
                      showArrow={true}
                      pressEffect={true}
                      shadow={true}
                      type="submit"
                      loading={isSubmitting || loginMutation.isPending}
                      className="w-full py-3 font-semibold transition-colors"
                    >
                      SIGN IN
                    </Button>

                    <div className="mt-4 text-sm text-center text-gray-600">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
