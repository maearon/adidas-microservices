"use client";

import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import flashMessage from '@/components/shared/flashMessages';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ShowErrors, { ErrorMessageType } from '@/components/shared/errorMessages';
import FullScreenLoader from '@/components/ui/FullScreenLoader';
import { fetchUser, selectUser } from '@/store/sessionSlice';
import { AppDispatch } from '@/store/store';
import { useAppSelector } from '@/store/hooks';
import { useCheckEmail } from '@/api/hooks/useCheckEmail';
import { useLoginMutation } from '@/api/hooks/useLoginMutation';
import { useSignupMutation } from '@/api/hooks/useSignupMutation';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Required'),
});

const LoginPage: NextPage = () => {
  const router = useRouter();
  const inputEl = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'email' | 'login' | 'register' | 'activate'>('email');
  const [email, setEmail] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [errors, setErrors] = useState<ErrorMessageType>({});
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const userData = useAppSelector(selectUser);

  const { mutateAsync: checkEmail, isPending: isChecking } = useCheckEmail();
  const { mutateAsync: loginMutation, isPending: isLoggingIn } = useLoginMutation();
  const { mutateAsync: signupMutation, isPending: isRegistering } = useSignupMutation();

  useEffect(() => {
    if (userData.value?.email) {
      router.push('/');
    }
  }, [userData.value, router]);

  const handleEmailSubmit = async (values: { email: string; keepLoggedIn: boolean }) => {
    try {
      const response = await checkEmail(values.email);
      setEmail(values.email);
      setKeepLoggedIn(values.keepLoggedIn);

      if (response?.exists) {
        if (response.user?.activated === false) setStep('activate');
        else setStep('login');
      } else {
        setStep('register');
      }
    } catch (error) {
      flashMessage('error', 'Something went wrong. Please try again.');
    }
  };

  const handleLogin = async (password: string) => {
    try {
      const res = await loginMutation({ email, password, keepLoggedIn });
      if (res) {
        await dispatch(fetchUser());
        flashMessage('success', 'Login successful!');
        router.push('/');
      } else {
        flashMessage('error', 'Invalid password');
      }
    } catch (err) {
      flashMessage('error', 'Login failed');
    }
  };

  const handleRegister = async (password: string) => {
    const payload = {
      user: {
        name: email.split("@")[0],
        email: email,
        password: password,
        password_confirmation: password,
      },
    };
    try {
      const res = await signupMutation(payload);
      if (res?.success) {
        flashMessage("success", "Account created! Please activate via email.");
        setStep("activate");
      } else {
        flashMessage("error", "Failed to create account");
      }
    } catch (err) {
      flashMessage("error", "Something went wrong");
    }
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    setTimeout(() => setSocialLoading(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white max-w-md w-full p-6 rounded shadow-lg relative overflow-y-auto max-h-[90vh]">
        <button onClick={() => router.push("/")} className="absolute top-4 right-4 text-xl font-bold">×</button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold uppercase mb-2">Your AdiClub benefits await</h2>
          <p className="text-sm text-gray-600">Get free shipping, vouchers and members-only products in adiClub.</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {['apple', 'facebook', 'google', 'yahoo'].map((provider) => (
            <button
              key={provider}
              onClick={() => handleSocialLogin(provider)}
              className="border p-2 flex items-center justify-center hover:bg-gray-100"
            >
              <img src={`/icons/${provider}.svg`} alt={provider} className="h-5" />
            </button>
          ))}
        </div>

        {step === 'email' && (
          <Formik
            initialValues={{ email: '', keepLoggedIn: true }}
            validationSchema={validationSchema}
            onSubmit={handleEmailSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-4">
                <Field name="email">
                  {({ field }: any) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="EMAIL ADDRESS *"
                      className="w-full border p-2"
                    />
                  )}
                </Field>
                <div className="flex items-center">
                  <Field type="checkbox" name="keepLoggedIn" checked={values.keepLoggedIn} onChange={() => setFieldValue("keepLoggedIn", !values.keepLoggedIn)} />
                  <span className="ml-2 text-sm">Keep me logged in</span>
                </div>
                <button type="submit" className="w-full bg-black text-white py-2 font-semibold">
                  {isChecking ? "LOADING..." : "CONTINUE →"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {step === 'login' && (
          <Formik
            initialValues={{ password: '' }}
            onSubmit={async (values) => await handleLogin(values.password)}
          >
            <Form className="space-y-4">
              <Field name="password">
                {({ field }: any) => (
                  <input {...field} type="password" placeholder="Password *" className="w-full border p-2" />
                )}
              </Field>
              <button type="submit" className="w-full bg-black text-white py-2">
                {isLoggingIn ? "LOADING..." : "SIGN IN"}
              </button>
            </Form>
          </Formik>
        )}

        {step === 'register' && (
          <Formik
            initialValues={{ password: '' }}
            validationSchema={Yup.object({
              password: Yup.string()
                .required("Required")
                .min(8, "Min 8 characters")
                .matches(/[A-Z]/, "1 uppercase")
                .matches(/[a-z]/, "1 lowercase")
                .matches(/[0-9]/, "1 number")
                .matches(/[@$!%*?&#]/, "1 special character"),
            })}
            onSubmit={async (values) => await handleRegister(values.password)}
          >
            <Form className="space-y-4">
              <Field name="password">
                {({ field }: any) => (
                  <input {...field} type="password" placeholder="Create Password *" className="w-full border p-2" />
                )}
              </Field>
              <button type="submit" className="w-full bg-black text-white py-2">
                {isRegistering ? "LOADING..." : "CREATE PASSWORD"}
              </button>
            </Form>
          </Formik>
        )}

        {step === 'activate' && (
          <div className="text-center">
            <h2 className="text-lg font-bold">Activate Your Account</h2>
            <p className="text-sm text-gray-600 mt-2">Check your email to activate your account and enjoy adiClub benefits.</p>
          </div>
        )}

        <p className="text-xs text-gray-600 mt-6">
          By clicking the “Continue” button, you agree to the
          <Link href="#" className="underline"> TERMS OF USE</Link>,
          <Link href="#" className="underline"> ADICLUB TERMS</Link> and
          <Link href="#" className="underline"> PRIVACY POLICY</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
