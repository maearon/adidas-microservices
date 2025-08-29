"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import flashMessage from "@/components/shared/flashMessages"
import javaService from "@/api/services/javaService"
import { formatPrice } from "@/lib/utils"

const validationSchema = Yup.object({
  cardNumber: Yup.string().required("Card number is required"),
  expiryDate: Yup.string().required("Expiry date is required"),
  cvv: Yup.string().required("CVV is required"),
  cardholderName: Yup.string().required("Cardholder name is required"),
  billingAddress: Yup.object({
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    zipCode: Yup.string().required("ZIP code is required"),
    country: Yup.string().required("Country is required"),
  }),
})

interface PaymentFormValues {
  paymentMethod: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress: {
    street: string
    city: string
    zipCode: string
    country: string
  }
}

export default function CheckoutPaymentPage() {
  const router = useRouter()
  const cartItems = useAppSelector((state) => state.cart.items)
  const [loading, setLoading] = useState(false)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number.parseFloat(formatPrice(item?.price).replace("$", "")) * item.quantity,
    0,
  )
  const tax = subtotal * 0.12
  const shipping = 0
  const total = subtotal + tax + shipping

  const initialValues: PaymentFormValues = {
    paymentMethod: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      street: "",
      city: "",
      zipCode: "",
      country: "US",
    },
  }

  const onSubmit = async (values: PaymentFormValues) => {
    setLoading(true)
    try {
      // Create payment intent
      const paymentIntent = await javaService.createPaymentIntent(Math.round(total * 100), "USD")

      // Process payment
      const paymentResult = await javaService.confirmPayment({
        payment_intent_id: paymentIntent.id,
        payment_method_id: values.cardNumber,
      })

      // Adjust this condition based on the actual PaymentIntentResponse type
      if (paymentResult.status === "succeeded") {
        // Create order
        const orderData = {
          shipping_address: values.billingAddress,
          billing_address: values.billingAddress,
          payment_method: values.paymentMethod,
        }

        const order = await javaService.createOrder(orderData)

        flashMessage("success", "Order placed successfully!")
        router.push(`/order-confirmation/${order.id}`)
      } else {
        flashMessage("error", "Payment failed. Please try again.")
      }
    } catch (error) {
      flashMessage("error", "Payment processing failed. Please try again.")
      console.error("Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
//         <button onClick={() => router.push("/")} className="bg-black text-white px-6 py-3 font-bold">
//           Continue Shopping
//         </button>
//       </div>
//     )
//   }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Payment Form */}
        <div>
          <h1 className="text-2xl font-bold mb-4">PAYMENT</h1>

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <h3 className="font-bold mb-4">PAYMENT METHOD</h3>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border rounded cursor-pointer">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        className="mr-3"
                        onChange={() => setFieldValue("paymentMethod", "credit-card")}
                      />
                      <span className="font-medium">Credit Card</span>
                      <div className="ml-auto flex space-x-2">
                        <img src="/icons/visa.svg" alt="Visa" className="h-6" />
                        <img src="/icons/mastercard.svg" alt="Mastercard" className="h-6" />
                        <img src="/icons/amex.svg" alt="Amex" className="h-6" />
                      </div>
                    </label>

                    <label className="flex items-center p-4 border rounded cursor-pointer">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        className="mr-3"
                        onChange={() => setFieldValue("paymentMethod", "paypal")}
                      />
                      <span className="font-medium">PayPal</span>
                      <img src="/icons/paypal.svg" alt="PayPal" className="ml-auto h-6" />
                    </label>

                    <label className="flex items-center p-4 border rounded cursor-pointer">
                      <Field
                        type="radio"
                        name="paymentMethod"
                        value="apple-pay"
                        className="mr-3"
                        onChange={() => setFieldValue("paymentMethod", "apple-pay")}
                      />
                      <span className="font-medium">Apple Pay</span>
                      <img src="/icons/apple-pay.svg" alt="Apple Pay" className="ml-auto h-6" />
                    </label>
                  </div>
                </div>

                {/* Credit Card Form */}
                {values.paymentMethod === "credit-card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2">CARD NUMBER *</label>
                      <Field
                        name="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="cardNumber" component="div" className="text-red-600 text-base mt-1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium mb-2">EXPIRY DATE *</label>
                        <Field
                          name="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                        />
                        <ErrorMessage name="expiryDate" component="div" className="text-red-600 text-base mt-1" />
                      </div>

                      <div>
                        <label className="block text-base font-medium mb-2">CVV *</label>
                        <Field
                          name="cvv"
                          type="text"
                          placeholder="123"
                          className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                        />
                        <ErrorMessage name="cvv" component="div" className="text-red-600 text-base mt-1" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">CARDHOLDER NAME *</label>
                      <Field
                        name="cardholderName"
                        type="text"
                        placeholder="John Doe"
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage name="cardholderName" component="div" className="text-red-600 text-base mt-1" />
                    </div>
                  </div>
                )}

                {/* Billing Address */}
                <div>
                  <h3 className="font-bold mb-4">BILLING ADDRESS</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-base font-medium mb-2">STREET ADDRESS *</label>
                      <Field
                        name="billingAddress.street"
                        type="text"
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                      />
                      <ErrorMessage
                        name="billingAddress.street"
                        component="div"
                        className="text-red-600 text-base mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium mb-2">CITY *</label>
                        <Field
                          name="billingAddress.city"
                          type="text"
                          className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                        />
                        <ErrorMessage
                          name="billingAddress.city"
                          component="div"
                          className="text-red-600 text-base mt-1"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-medium mb-2">ZIP CODE *</label>
                        <Field
                          name="billingAddress.zipCode"
                          type="text"
                          className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                        />
                        <ErrorMessage
                          name="billingAddress.zipCode"
                          component="div"
                          className="text-red-600 text-base mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-base font-medium mb-2">COUNTRY *</label>
                      <Field
                        as="select"
                        name="billingAddress.country"
                        className="w-full border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-black"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="VN">Vietnam</option>
                      </Field>
                      <ErrorMessage
                        name="billingAddress.country"
                        component="div"
                        className="text-red-600 text-base mt-1"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-4 font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {loading ? "PROCESSING..." : `COMPLETE ORDER - $${total.toFixed(2)}`}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-bold mb-6">ORDER SUMMARY</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex space-x-4">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-cover" />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-base text-gray-600 dark:text-white">{item.color}</p>
                    <p className="text-base text-gray-600 dark:text-white">Size: {item.size}</p>
                    <p className="text-base text-gray-600 dark:text-white">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      ${(Number.parseFloat(formatPrice(item?.price).replace("$", "")) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
