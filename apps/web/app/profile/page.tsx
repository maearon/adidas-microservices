"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useAppSelector } from "@/store/hooks"
import { selectUser, fetchUser } from "@/store/sessionSlice"
import type { AppDispatch } from "@/store/store"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import api from "@/api/client"

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string(),
  dateOfBirth: Yup.date(),
  gender: Yup.string(),
})

interface ProfileFormValues {
  name: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
}

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const userData = useAppSelector(selectUser)
  const [loading, setLoading] = useState(false)
  const token = (typeof window !== "undefined")
    ? localStorage.getItem("token") || sessionStorage.getItem("token")
    : null;

  const initialValues: ProfileFormValues = {
    name: userData.value?.name || "",
    email: userData.value?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  }

  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true)
    try {
      const response = await api.put("/profile", {
        user: values,
      })

      if (response.data.success) {
        flashMessage("success", "Profile updated successfully")
        if (token) {
        dispatch(fetchUser())
        }
      }
    } catch (error) {
      flashMessage("error", "Failed to update profile")
      console.error("Profile update error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">PERSONAL INFORMATION</h1>
      <p className="text-gray-600 mb-4">Update your personal details here.</p>

      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-medium mb-2">FIRST NAME *</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                />
                <ErrorMessage name="name" component="div" className="text-red-600 text-base mt-1" />
              </div>

              <div>
                <label className="block text-base font-medium mb-2">EMAIL *</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-base mt-1" />
              </div>

              <div>
                <label className="block text-base font-medium mb-2">PHONE NUMBER</label>
                <Field
                  name="phone"
                  type="tel"
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                />
                <ErrorMessage name="phone" component="div" className="text-red-600 text-base mt-1" />
              </div>

              <div>
                <label className="block text-base font-medium mb-2">DATE OF BIRTH</label>
                <Field
                  name="dateOfBirth"
                  type="date"
                  className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                />
                <ErrorMessage name="dateOfBirth" component="div" className="text-red-600 text-base mt-1" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-base font-medium mb-2">GENDER</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <Field type="radio" name="gender" value="male" className="mr-2" />
                    Male
                  </label>
                  <label className="flex items-center">
                    <Field type="radio" name="gender" value="female" className="mr-2" />
                    Female
                  </label>
                  <label className="flex items-center">
                    <Field type="radio" name="gender" value="other" className="mr-2" />
                    Other
                  </label>
                </div>
                <ErrorMessage name="gender" component="div" className="text-red-600 text-base mt-1" />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                type="button"
                className="border border-gray-300 px-8 py-3 font-bold hover:bg-gray-50 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
