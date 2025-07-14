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
import AdidasSpinner from "@/components/ui/AdidasSpinner"
import { handleApiError } from "@/components/shared/handleApiError"
import { Checkbox } from "@/components/ui/checkbox"

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const LoginPage = () => {
  const router = useRouter()
  const loginMutation = useLoginMutation()
  const { data: user, isLoading, isError, isFetched } = useCurrentUser()
  const [keepLoggedIn, setKeepLoggedIn] = useState(true)
  const [errors, setErrors] = useState<ErrorMessageType>({})
  const [hasMounted, setHasMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => setHasMounted(true), [])

  useEffect(() => {
    if (isFetched && user?.email) {
      setTimeout(() => router.replace("/my-account"), 0)
    }
  }, [isFetched, user, router])

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
      onError: (error: any) => {
        const parsed = handleApiError(error)
        setErrors(parsed)
        if (parsed?.general?.[0]) flashMessage("error", parsed.general[0])
      },
    })
  }

  const handleGoogleLogin = () => {
    const clientId = "588366578054-bqg4hntn2fts7ofqk0s19286tjddnp0v.apps.googleusercontent.com"
    const redirectUri = `${window.location.origin}/oauth/callback`
    const scope = "openid email profile"
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    window.location.href = authUrl
  }

  if (!hasMounted || isLoading) return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <AdidasSpinner />
    </div>
  )

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
            {/* Left promo section */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <Image
                  src="/assets/login/account-portal-page-inline.png"
                  alt="Adiclub Benefits"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover mb-6 rounded"
                />
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">a</span>
                  </div>
                  <h2 className="text-2xl font-bold">JOIN ADICLUB TO UNLOCK MORE REWARDS</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Join adiClub for free and enjoy immediate access to these Level 1 rewards:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center"><span className="text-blue-600 mr-2">✓</span>Welcome Bonus Voucher for 15% off</li>
                  <li className="flex items-center"><span className="text-blue-600 mr-2">✓</span>Free Shipping and Returns</li>
                  <li className="flex items-center"><span className="text-blue-600 mr-2">✓</span>Members-Only Products</li>
                  <li className="flex items-center"><span className="text-blue-600 mr-2">✓</span>Early Access to Sales</li>
                  <li className="flex items-center"><span className="text-blue-600 mr-2">✓</span>Access to Limited Editions</li>
                </ul>
                <p className="text-gray-600 mb-6">
                  Start earning adiClub points every time you shop, track a run on the adidas Running app and share a product review.
                  The more points you earn, the faster you'll level up and unlock rewards such as a Birthday Gift, Free Personalisation, Priority Customer Service, Premium Event Tickets and more.
                </p>
              </div>
            </div>

            {/* Login Form section */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <span className="text-blue-600 font-bold text-2xl">adiclub</span>
                </div>
                <h2 className="text-xl font-bold mb-2">YOUR ADICLUB BENEFITS AWAIT</h2>
                <p className="text-gray-600 text-sm">
                  Get free shipping, discount vouchers and members only products when you're in adiClub.
                </p>
              </div>

              <p className="font-medium mb-4">Log in or sign up (it's free)</p>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {["apple", "facebook", "google", "yahoo"].map((name) => (
                  <button
                    key={name}
                    onClick={name === "google" ? handleGoogleLogin : undefined}
                    className="border border-gray-300 p-3 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label={`Login with ${name}`}
                  >
                    <img src={`/icons/${name}.svg`} alt={name} className="h-5" />
                  </button>
                ))}
              </div>

              <Formik
                initialValues={{ email: "", password: "", keepLoggedIn: true }}
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
                        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3 right-3 text-gray-600 text-xs"
                      >
                        {showPassword ? (
                          <><EyeOff className="inline-block w-4 h-4 mr-1" /> HIDE</>
                        ) : (
                          <><Eye className="inline-block w-4 h-4 mr-1" /> SHOW</>
                        )}
                      </button>
                      <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    {/* <div className="flex items-center space-x-2">
                      <Field type="checkbox" name="rememberMe" checked={values.rememberMe} />
                      <label className="text-sm text-gray-600">
                        Keep me logged in. Applies to all options. <Link href="#" className="text-blue-600 underline">More info</Link>
                      </label>
                    </div> */}

                    {/* Keep me logged in */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="keepLoggedIn"
                        checked={values.keepLoggedIn}
                        onCheckedChange={(checked) => setFieldValue("keepLoggedIn", checked)}
                      />
                      <label htmlFor="keepLoggedIn" className="text-sm">
                        Keep me logged in. Applies to all options.{" "}
                        <button type="button" className="underline">
                          More info
                        </button>
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
                      CONTINUE
                    </Button>

                    <div className="mt-4 text-sm text-gray-600 text-center">
                      Don't have an account yet? <Link href="/signup" className="underline text-blue-600">Sign up</Link>
                    </div>
                    <div className="mt-2 text-sm text-center">
                      Forgot your password? <Link href="/password_resets/new" className="underline text-blue-600" target="_blank">Reset it here</Link>
                    </div>
                    <div className="mt-6 text-xs text-gray-500">
                      <p className="mb-2">Sign me up to adiClub, featuring exclusive adidas offers and news</p>
                      <p>
                        By clicking the "Continue" button, you are joining adiClub and agree to the <Link href="#" className="text-blue-600 underline">TERMS OF USE</Link>, <Link href="#" className="text-blue-600 underline">ADICLUB TERMS</Link>, and <Link href="#" className="text-blue-600 underline">PRIVACY POLICY</Link>.
                      </p>
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
