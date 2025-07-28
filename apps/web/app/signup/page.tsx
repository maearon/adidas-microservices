"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import Link from "next/link"
import { useSignupMutation } from "@/api/hooks/useSignupMutation"
import { Button } from "@/components/ui/button"
import { handleApiError } from "@/components/shared/handleApiError"
import Image from "next/image"
import AdidasLogo from "@/components/adidas-logo"

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

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
      <div className="relative bg-white md:py-8 pt-1 pb-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:gap-8 gap-2 items-start">
            {/* Left info box */}
            <div className="space-y-6">
              <div className="bg-white md:p-8 p-1 rounded-none">
                <Image
                  src="/assets/login/account-portal-page-inline.png"
                  alt="Adiclub Benefits"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover mb-6 rounded-none"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">a</span>
                  </div>
                  <h2 className="text-2xl font-bold">JOIN ADICLUB. GET A 15% DISCOUNT.</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  As an adiClub member you get rewarded with what you love for doing what you love. Sign up today and
                  receive immediate access to these Level 1 benefits:
                </p>
                <ul className="space-y-2 text-base">
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Free shipping</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> A 15% off voucher</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Members Only sales</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Access to adidas apps</li>
                  <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Special promotions</li>
                </ul>
              </div>
            </div>

            {/* Signup form */}
            <div className="bg-white md:p-8 p-1 rounded-none">
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
              <h1 className="text-2xl font-bold mb-2 scale-x-110 origin-left">SIGN UP</h1>
              <p className="mb-4">Enjoy members-only access to exclusive products, experiences, offers and more.</p>

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
                        className="w-full border border-black p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-base mt-1" />
                    </div>

                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="EMAIL *"
                        className="w-full border border-black p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-base mt-1" />
                    </div>

                    <div>
                      <Field
                        name="password"
                        type="password"
                        placeholder="PASSWORD *"
                        className="w-full border border-black p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="password" component="div" className="text-red-500 text-base mt-1" />
                    </div>

                    <div>
                      <Field
                        name="password_confirmation"
                        type="password"
                        placeholder="CONFIRM PASSWORD *"
                        className="w-full border border-black p-3 rounded-none focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="password_confirmation" component="div" className="text-red-500 text-base mt-1" />
                    </div>

                    <Button
                      theme={"black"}
                      showArrow
                      pressEffect
                      shadow
                      type="submit"
                      loading={isSubmitting || signupMutation.isPending}
                      className="w-full py-3 font-semibold transition-colors"
                    >
                      CREATE MY ACCOUNT
                    </Button>

                    <div className="mt-4 text-base text-gray-600 text-center">
                      Already have an account?{" "}
                      <Link href="/account-login" className="underline text-blue-600">
                        Log in
                      </Link>
                    </div>

                    <div className="mt-2 text-base text-center">
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
