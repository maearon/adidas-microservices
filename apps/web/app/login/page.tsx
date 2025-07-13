"use client";
import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import flashMessage from '@/components/shared/flashMessages'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import ShowErrors, { ErrorMessageType } from '@/components/shared/errorMessages';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { fetchUser, selectUser } from '@/store/sessionSlice';
import { AppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import javaService from '@/api/services/javaService';
import { Nullable } from '@/types/common';
if (typeof window !== "undefined") {
const token = localStorage.getItem("token") || sessionStorage.getItem("token");
}

const initialValues = {
  email: '',
  password: '',
  rememberMe: '1',
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
  const inputEl = useRef() as MutableRefObject<HTMLInputElement>
  const [errors, setErrors] = useState<ErrorMessageType>({});
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const userData = useAppSelector(selectUser)

  useEffect(() => {
      const fetchUserData = async () => {
        try {
          setLoading(false)
          let token: Nullable<string> = null;
          if (typeof window !== "undefined") {
            token = localStorage.getItem("token") || sessionStorage.getItem("token");
          }
          if (token) {
            const resultAction = await dispatch(fetchUser())
            if (fetchUser.fulfilled.match(resultAction) && resultAction.payload?.user?.email) {
              router.push("/")
            } else if (fetchUser.rejected.match(resultAction)) {
              setLoading(false)
            }
          }
          setLoading(false)
        } catch (error) {
          console.error("Failed to fetch user:", error)
          setLoading(false)
        } finally {
          setLoading(false)
        }
      }
  
      fetchUserData()
    }, [dispatch, router])

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Required'),
    password: Yup.string().required('Required')
  })

  const onSubmit = (values: MyFormValues) => {
    flashMessage("error", "User or password incorrect")
    javaService.login({
      session: {
        email: values.email,
        password: values.password,
      }
    })
    .then(response => {
      if (response.user) {
        inputEl.current.blur()
        const { token } = response.tokens.access
        if (values.rememberMe === '1') {
          if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
          localStorage.setItem("refresh_token", response.tokens.refresh.token)
          }
        } else {
          // sessionStorage.setItem("token", token)
          // sessionStorage.setItem("refresh_token", response.tokens.refresh.token)
          if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
          localStorage.setItem("refresh_token", response.tokens.refresh.token)
          localStorage.setItem("guest_cart_id", '123-xyz')
          }
        }
        if (token) {
        dispatch(fetchUser())
        }
        router.push("/")
      }
      // if (response.flash) flashMessage(...response.flash)
      // Handle possible error messages if present in response
      if ('errors' in response && Array.isArray((response as any).errors) && (response as any).errors.length > 0) {
        setErrors((response as any).errors)
      }
    })
    .catch(error => {
      flashMessage("error", error.toString())
      setErrors({ email: ["or password incorrect"] })
    })
  }

  if (loading) return <FullScreenLoader />

  return userData.value && userData.value.email ? (
    <div className="p-8 text-center text-xl">Bạn đã đăng nhập.</div>
  ) : (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button onClick={() => router.push("/")} className="absolute top-4 right-4 text-xl font-bold">×</button>
        <h2 className="text-xl font-bold uppercase mb-2">Your AdiClub benefits await</h2>
        <p className="mb-4 text-sm">Get free shipping, discount vouchers and members only products when you’re in adiClub.</p>

        <p className="font-medium mb-2">Log in or sign up (it’s free)</p>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {["apple", "facebook", "google", "yahoo"].map((provider) => (
            <button
              key={provider}
              className="border p-2 flex items-center justify-center hover:bg-gray-100"
              aria-label={`Login with ${provider}`}
            >
              <img src={`/icons/${provider}.svg`} alt={provider} className="h-5" />
            </button>
          ))}
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            {Object.keys(errors).length > 0 && <ShowErrors errorMessage={errors} />}

            <Field
              name="email"
              type="email"
              placeholder="EMAIL ADDRESS *"
              className="w-full border p-2 mb-2"
            />

            <Field
              name="password"
              type="password"
              placeholder="PASSWORD *"
              className="w-full border p-2 mb-2"
            />
            <ErrorMessage name='password'>
              {error => <div className='text-red-600 text-sm mb-2'>{error}</div>}
            </ErrorMessage>

            <div className="flex items-center mb-2">
              <Field type="checkbox" name="rememberMe" value="1" className="mr-2" />
              <label className="text-sm">
                Keep me logged in. Applies to all options. <Link href="#" className="underline ml-1">More info</Link>
              </label>
            </div>

            <button
              type="submit"
              ref={inputEl}
              className="w-full bg-black text-white py-2 font-semibold hover:bg-gray-800 transition"
            >
              CONTINUE →
            </button>
          </Form>
        </Formik>

        <p className="text-xs text-gray-600 mt-4">
          By clicking the “Continue” button, you are joining adiClub, will receive emails with the latest news and updates,
          and agree to the <Link href="#" className="underline">TERMS OF USE</Link> and <Link href="#" className="underline">ADICLUB TERMS</Link> and <Link href="#" className="underline">PRIVACY POLICY</Link>.
        </p>
        <p className="mt-4 text-sm">
          New user? <Link href="/signup" className="text-blue-500 hover:underline">Sign up now!</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
