"use client"

import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

export type PaymentMethod = "stripe" | "paypal" | "momo" | "vnpay" | "cod"

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod | null
  onSelectMethod: (method: PaymentMethod) => void
  country?: string
  stripeForm?: React.ReactNode  // 👈 thêm prop này
  stripeError?: string | null  // 👈 thêm prop này
}

export default function PaymentMethods({
  selectedMethod,
  onSelectMethod,
  country = "US",
  stripeForm = <></>,
  stripeError = null,
}: PaymentMethodsProps) {
  const isVietnam = country === "VN" || country === "Vietnam"

  return (
    <div className="space-y-6">
      {/* Security Message */}
      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Payments are SSL encrypted so that your credit card and payment details stay safe.</span>
      </div>

      {/* Credit/Debit Card (Stripe) */}
      <div>
        <h3 className="text-sm font-bold mb-2">Credit/Debit Card</h3>
        <div className="flex items-center gap-2 mb-4">
          {["download.svg", "download (1).svg", "download (2).svg", "download (3).svg"].map((img, idx) => (
            <div key={idx} className="w-12 h-8 relative">
              <Image
                src={`/assets/payment/${img}`}
                alt="Card"
                fill
                className="object-contain grayscale"
              />
            </div>
          ))}
        </div>
        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedMethod === "stripe"
              ? "border-black dark:border-white"
              : "border-gray-200 dark:border-gray-700"
          }`}
          onClick={() => onSelectMethod("stripe")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <Checkbox
              checked={selectedMethod === "stripe"}
              onCheckedChange={() => onSelectMethod("stripe")}
            />
            <span className="text-sm font-medium">Pay with Credit/Debit Card (Stripe)</span>
            {/* ✅ hiện form nếu được chọn */}
            {selectedMethod === "stripe" && (
              <div className="mt-4">{stripeForm}</div>
            )}
            {selectedMethod === "stripe" && (
              <div className="border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h3 className="text-sm font-semibold">Card details</h3>
                {stripeError && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2">
                    {stripeError}
                  </div>
                )}
                {stripeForm}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your payment details are encrypted and processed securely by Stripe.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* PayPal */}
      <div>
        <h3 className="text-sm font-bold mb-2">PayPal</h3>
        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedMethod === "paypal"
              ? "border-black dark:border-white"
              : "border-gray-200 dark:border-gray-700"
          }`}
          onClick={() => onSelectMethod("paypal")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <Checkbox
              checked={selectedMethod === "paypal"}
              onCheckedChange={() => onSelectMethod("paypal")}
            />
            <div className="w-16 h-10 relative">
              <Image
                src="/assets/payment/download (11).svg"
                alt="PayPal"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm">You will be redirected to PayPal to complete your payment.</span>
          </CardContent>
        </Card>
      </div>

      {/* Vietnam Payment Methods */}
      {isVietnam && (
        <>
          {/* MoMo */}
          <div>
            <h3 className="text-sm font-bold mb-2">MoMo E-Wallet</h3>
            <Card
              className={`cursor-pointer border-2 transition-all ${
                selectedMethod === "momo"
                  ? "border-black dark:border-white"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onSelectMethod("momo")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Checkbox
                  checked={selectedMethod === "momo"}
                  onCheckedChange={() => onSelectMethod("momo")}
                />
                <div className="w-16 h-10 relative bg-pink-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MoMo</span>
                </div>
                <span className="text-sm">Pay with MoMo wallet</span>
              </CardContent>
            </Card>
          </div>

          {/* VNPay */}
          <div>
            <h3 className="text-sm font-bold mb-2">VNPay</h3>
            <Card
              className={`cursor-pointer border-2 transition-all ${
                selectedMethod === "vnpay"
                  ? "border-black dark:border-white"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onSelectMethod("vnpay")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Checkbox
                  checked={selectedMethod === "vnpay"}
                  onCheckedChange={() => onSelectMethod("vnpay")}
                />
                <div className="w-16 h-10 relative bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">VNPay</span>
                </div>
                <span className="text-sm">Pay with VNPay (Bank transfer, ATM, e-wallet)</span>
              </CardContent>
            </Card>
          </div>

          {/* Cash on Delivery */}
          <div>
            <h3 className="text-sm font-bold mb-2">Cash on Delivery</h3>
            <Card
              className={`cursor-pointer border-2 transition-all ${
                selectedMethod === "cod"
                  ? "border-black dark:border-white"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onClick={() => onSelectMethod("cod")}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Checkbox
                  checked={selectedMethod === "cod"}
                  onCheckedChange={() => onSelectMethod("cod")}
                />
                <span className="text-sm font-medium">Pay when receiving goods (COD)</span>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Other Payment Methods (International) */}
      {!isVietnam && (
        <div>
          <h3 className="text-sm font-bold mb-2">Other ways to pay</h3>
          <div className="space-y-2">
            {/* Klarna */}
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 relative">
                    <Image
                      src="/assets/payment/download (7).svg"
                      alt="Klarna"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">4 Interest-Free Installments</span>
                </div>
              </CardContent>
            </Card>

            {/* Afterpay */}
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 relative">
                    <Image
                      src="/assets/payment/download (12).svg"
                      alt="Afterpay"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">4 Interest-Free Payments by Afterpay</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Place your order today and pay in 4 payments every 2 weeks. No interest or fees when you pay on time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affirm */}
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 relative">
                    <Image
                      src="/assets/payment/download (10).svg"
                      alt="Affirm"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">
                    Payment options depend on purchase amount. No late fees.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Gift Card */}
      <div className="p-4 flex items-center gap-3">
        <Checkbox
          id="useGiftCard"
        />
        <label htmlFor="useGiftCard" className="text-sm font-medium">
          Use an adidas gift card
        </label>
      </div>
    </div>
  )
}

