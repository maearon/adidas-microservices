"use client"

import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type MutableRefObject, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import flashMessage from "@/components/shared/flashMessages"
import { ErrorMessage, Field, Form, Formik } from "formik"
import * as Yup from "yup"
import ShowErrors, { type ErrorMessageType } from "@/components/shared/errorMessages"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { fetchUser, selectUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import { useAppSelector } from "@/store/hooks"
import { useLoginMutation } from "@/api/hooks/useLoginMutation"
import { useCurrentUser } from "@/api/hooks/useCurrentUser"
import { Button } from "@/components/ui/button"

const initialValues = {
  email: "",
  password: "",
  rememberMe: "1",
  errors: [] as string[],
}

interface MyFormValues {
  email: string
  password: string
  rememberMe: string
  errors: string[]
}

const LoginPage: NextPage = () => {
  const router = useRouter()
  const inputEl = useRef<HTMLButtonElement>(null)
  const [errors, setErrors] = useState<ErrorMessageType>({})
  const dispatch = useDispatch<AppDispatch>()
  const userData = useAppSelector(selectUser)
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

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Required"),
  })

  const {
    mutateAsync: loginMutation,
    isPending,
    status,
    error,
  } = useLoginMutation()

  const onSubmit = async (values: MyFormValues) => {
    try {
      const response = await loginMutation({
        email: values.email,
        password: values.password,
        remember_me: values.rememberMe === "1",
      })

      
      if (response.tokens) { flashMessage("Logged in successfully", "success"); router.push("/") }
    } catch (error) {
      console.error("Login error", error)
      setErrors({ email: ["or password incorrect"] })
    }
  }

  const handleGoogleLogin = () => {
    const clientId = "588366578054-bqg4hntn2fts7ofqk0s19286tjddnp0v.apps.googleusercontent.com"
    const redirectUri = `${window.location.origin}/oauth/callback`
    const scope = "openid email profile"
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    window.location.href = authUrl
  }

  if (!hasMounted || isLoading) return <FullScreenLoader />

  if (isError) {
    flashMessage("error", "Session expired or unauthorized. Please login again.")
  }

  if (user?.email) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
          <p className="text-gray-600 mb-4">You are already logged in.</p>
          <Link href="/my-account" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
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
            <Image
                            src="/placeholder.png"
                            alt="Adiclub Benefits"
                            width={600}
                            height={600}
                            className="w-full h-auto object-cover mb-6 rounded"
                          />
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-xs">
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

            {/* Login form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-blue-600 font-bold text-2xl">adiclub</span>
                </div>
                <h2 className="text-xl font-bold mb-2">YOUR ADICLUB BENEFITS AWAIT</h2>
                <p className="text-gray-600 text-base">
                  Get free shipping, discount vouchers and members only products when you're in adiClub.
                </p>
              </div>

              <p className="font-medium mb-4">Log in or sign up (it's free)</p>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {[{ name: "apple" }, { name: "facebook" }, { name: "google", onClick: handleGoogleLogin }, { name: "yahoo" }].map(({ name, onClick }) => (
                  <button
                    key={name}
                    onClick={onClick}
                    className="border border-gray-300 p-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label={`Login with ${name}`}
                  >
                    <img src={`/icons/${name}.svg`} alt={name} className="h-5" />
                  </button>
                ))}
              </div>

              <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ values, errors: formErrors, touched }) => (
                  <Form className="space-y-4">
                    {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="EMAIL ADDRESS *"
                        className={`w-full border p-3 rounded ${formErrors.email && touched.email ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:outline-hidden`}
                      />
                      <ErrorMessage name="email">
                        {(error) => <div className="text-red-500 text-base mt-1">{error}</div>}
                      </ErrorMessage>
                    </div>

                    <div>
                      <Field
                        name="password"
                        type="password"
                        placeholder="PASSWORD *"
                        className={`w-full border p-3 rounded ${formErrors.password && touched.password ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:outline-hidden`}
                      />
                      <ErrorMessage name="password">
                        {(error) => <div className="text-red-500 text-base mt-1">{error}</div>}
                      </ErrorMessage>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Field type="checkbox" name="rememberMe" value="1" className="mt-1" checked={values.rememberMe === "1"} />
                      <label className="text-base text-gray-600">
                        Keep me logged in. Applies to all options. <Link href="#" className="text-blue-600 underline">More info</Link>
                      </label>
                    </div>

                    <Button
                      loading={isPending}
                      type="submit"
                      // ref={inputEl}
                      className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      CONTINUE
                    </Button>

                    <div className="mt-4 text-base text-gray-600 text-center">
                      Don't have an account yet?{" "}
                      <Link href="/signup" className="underline text-blue-600">
                        Sign up
                      </Link>
                    </div>

                    <div className="mt-2 text-base text-center">
                      Forgot your password?{" "}
                      <Link
                        href="/password_resets/new"
                        className="underline text-blue-600"
                        target="_blank"
                      >
                        Send Change your password link with token to your email
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>

              <div className="mt-6 text-xs text-gray-500">
                <p className="mb-2">Sign me up to adiClub, featuring exclusive adidas offers and news</p>
                <p>
                  By clicking the "Continue" button, you are joining adiClub and agree to the <Link href="#" className="text-blue-600 underline">TERMS OF USE</Link>, <Link href="#" className="text-blue-600 underline">ADICLUB TERMS</Link>, and <Link href="#" className="text-blue-600 underline">PRIVACY POLICY</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
