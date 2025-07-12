"use client"

import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import Link from "next/link"
import { useSignupMutation } from "@/api/hooks/useSignupMutation"
import { Button } from "@/components/ui/button"
import { handleApiError } from "@/components/shared/handleApiError"

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Password confirmation is required"),
})

const SignupPage = () => {
  const router = useRouter()
  const signupMutation = useSignupMutation()
  const [errors, setErrors] = useState<ErrorMessageType>({})

  const handleSubmit = async (values: any) => {
    setErrors({})

    const payload = {
      user: {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      }
    }

    signupMutation.mutate(payload, {
      onSuccess: (response: any) => {
        if (response.success) {
          flashMessage("success", response.message || "Signup successful.")
          router.push("/account-login")
        } else if (response.errors) {
          setErrors(response.errors)
        }
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
          flashMessage("error", "Something went wrong during signup.")
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
                  <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mr-4 font-bold text-xl">a</div>
                  <h2 className="text-2xl font-bold">JOIN ADICLUB. GET A 15% DISCOUNT.</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  As an adiClub member you get rewarded with what you love. Sign up today and get these Level 1 benefits:
                </p>
                <ul className="space-y-2 text-sm">
                  <li>✓ Free shipping</li>
                  <li>✓ A 15% off voucher</li>
                  <li>✓ Members Only sales</li>
                  <li>✓ Access to adidas apps</li>
                  <li>✓ Special promotions</li>
                </ul>
              </div>
            </div>

            {/* Signup form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h1 className="text-xl font-bold mb-6 text-center">CREATE ACCOUNT</h1>

              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  password_confirmation: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

                    <div>
                      <Field
                        name="name"
                        type="text"
                        placeholder="NAME *"
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

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

                    <div>
                      <Field
                        name="password_confirmation"
                        type="password"
                        placeholder="CONFIRM PASSWORD *"
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <Button
                      theme={"black"}
                      showArrow={true}
                      pressEffect={true}
                      shadow={true}
                      type="submit"
                      loading={isSubmitting || signupMutation.isPending}
                      className="w-full py-3 font-semibold transition-colors"
                    >
                      CREATE MY ACCOUNT
                    </Button>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                      Already have an account?{" "}
                      <Link href="/account-login" className="underline text-blue-600">
                        Log in
                      </Link>
                    </div>

                    <div className="mt-2 text-sm text-center">
                      Didn't get your activation email?{" "}
                      <Link
                        href="/account_activations/new"
                        className="underline text-blue-600"
                        target="_blank"
                      >
                        Resend activation
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

export default SignupPage
