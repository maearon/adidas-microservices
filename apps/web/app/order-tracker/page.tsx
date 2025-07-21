"use client"

import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"

const validationSchema = Yup.object({
  orderNumber: Yup.string().required("Order number is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
})

interface TrackingFormValues {
  orderNumber: string
  email: string
}

interface OrderStatus {
  order_number: string
  status: string
  tracking_number?: string
  estimated_delivery?: string
  items: any[]
  shipping_address: any
}

export default function OrderTrackerPage() {
  const [loading, setLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)

  const initialValues: TrackingFormValues = {
    orderNumber: "",
    email: "",
  }

  const onSubmit = async (values: TrackingFormValues) => {
    setLoading(true)
    try {
      // Mock API call - replace with actual API
      const response = await fetch(`/api/orders/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        const data = await response.json()
        setOrderStatus(data)
      } else {
        flashMessage("error", "Order not found. Please check your order number and email.")
      }
    } catch (error) {
      flashMessage("error", "Failed to track order. Please try again.")
      console.error("Order tracking error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-6">PACKAGE TRACKING AND RETURNS</h1>
          <p className="text-gray-600 mb-4">Track your order status</p>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">ORDER NUMBER *</label>
                  <Field
                    name="orderNumber"
                    type="text"
                    placeholder="Enter your order number"
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="orderNumber" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">EMAIL ADDRESS *</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "TRACKING..." : "TRACK"}
                </button>
              </Form>
            )}
          </Formik>

          {orderStatus && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Order Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Order Number:</span>
                  <span>{orderStatus.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      orderStatus.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : orderStatus.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {orderStatus.status.toUpperCase()}
                  </span>
                </div>
                {orderStatus.tracking_number && (
                  <div className="flex justify-between">
                    <span className="font-medium">Tracking Number:</span>
                    <span>{orderStatus.tracking_number}</span>
                  </div>
                )}
                {orderStatus.estimated_delivery && (
                  <div className="flex justify-between">
                    <span className="font-medium">Estimated Delivery:</span>
                    <span>{new Date(orderStatus.estimated_delivery).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
