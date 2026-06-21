"use client"

import Image from "next/image"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslations } from "@/hooks/useTranslations"

export type PaymentMethod = "stripe" | "paypal" | "momo" | "vnpay" | "cod"

interface PaymentMethodsProps {
  selectedMethod: PaymentMethod | null
  onSelectMethod: (method: PaymentMethod) => void
  country?: string
  stripeForm?: React.ReactNode
  stripeError?: string | null
}

export default function PaymentMethods({
  selectedMethod,
  onSelectMethod,
  country = "US",
  stripeForm = <></>,
  stripeError = null,
}: PaymentMethodsProps) {
  const t = useTranslations("commerce")
  const pm = t?.paymentMethods
  const isVietnam = country === "VN" || country === "Vietnam"

  return (
    <div className="space-y-6">
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
        <span>
          {pm?.sslEncrypted ??
            "Payments are SSL encrypted so that your credit card and payment details stay safe."}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">{pm?.creditDebitCard ?? "Credit/Debit Card"}</h3>

        <Card
          className={`cursor-pointer border-2 transition-all ${
            selectedMethod === "stripe"
              ? "border-black dark:border-white"
              : "border-gray-200 dark:border-gray-700"
          }`}
          onClick={() => onSelectMethod("stripe")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <Checkbox
                checked={selectedMethod === "stripe"}
                onCheckedChange={() => onSelectMethod("stripe")}
              />
              <span className="text-sm font-medium">
                {pm?.payWithStripe ?? "Pay with Credit/Debit Card (Stripe)"}
              </span>
            </div>

            {selectedMethod === "stripe" && (
              <div className="border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <h3 className="text-sm font-semibold">{pm?.cardDetails ?? "Card details"}</h3>
                {stripeError && (
                  <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 overflow-hidden">
                    {stripeError}
                  </div>
                )}
                {stripeForm}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pm?.stripeSecure ??
                    "Your payment details are encrypted and processed securely by Stripe."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-sm font-bold mb-2">{pm?.paypal ?? "PayPal"}</h3>
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
                alt={pm?.paypal ?? "PayPal"}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm">
              {pm?.paypalRedirect ?? "You will be redirected to PayPal to complete your payment."}
            </span>
          </CardContent>
        </Card>
      </div>

      {isVietnam && (
        <>
          <div>
            <h3 className="text-sm font-bold mb-2">{pm?.momoWallet ?? "MoMo E-Wallet"}</h3>
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
                <span className="text-sm">{pm?.payWithMomo ?? "Pay with MoMo wallet"}</span>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">{pm?.vnpay ?? "VNPay"}</h3>
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
                <span className="text-sm">
                  {pm?.payWithVnpay ?? "Pay with VNPay (Bank transfer, ATM, e-wallet)"}
                </span>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-sm font-bold mb-2">{pm?.cashOnDelivery ?? "Cash on Delivery"}</h3>
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
                <span className="text-sm font-medium">
                  {pm?.payCod ?? "Pay when receiving goods (COD)"}
                </span>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!isVietnam && (
        <div>
          <h3 className="text-sm font-bold mb-2">{pm?.otherWaysToPay ?? "Other ways to pay"}</h3>
          <div className="space-y-2">
            <Card className="border border-gray-200 dark:border-gray-700">
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
                  <span className="text-sm">
                    {pm?.klarnaInstallments ?? "4 Interest-Free Installments"}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
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
                    <p className="text-sm font-medium">
                      {pm?.afterpayTitle ?? "4 Interest-Free Payments by Afterpay"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {pm?.afterpayDescription ??
                        "Place your order today and pay in 4 payments every 2 weeks. No interest or fees when you pay on time."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-gray-700">
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
                    {pm?.affirmDescription ??
                      "Payment options depend on purchase amount. No late fees."}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="p-4 flex items-center gap-3">
        <Checkbox id="useGiftCard" />
        <label htmlFor="useGiftCard" className="text-sm font-medium">
          {pm?.useGiftCard ?? "Use an adidas gift card"}
        </label>
      </div>
    </div>
  )
}
