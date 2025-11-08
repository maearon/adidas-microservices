"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type StripePaymentConfirmation = {
  paymentIntentId: string
}

export type StripePaymentFormHandle = {
  confirmPayment: () => Promise<StripePaymentConfirmation>
}

type StripePaymentFormProps = {
  amount: number
  currency?: string
  customerEmail?: string
  className?: string
  onError?: (message: string | null) => void
}

const StripePaymentFormInner = forwardRef<StripePaymentFormHandle, StripePaymentFormProps>(
  function StripePaymentFormInner(
    { amount, currency = "usd", customerEmail, className, onError },
    ref,
  ) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const stripePromise = useMemo(
      () => (publishableKey ? loadStripe(publishableKey) : null),
      [publishableKey],
    )

    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [initialised, setInitialised] = useState(false)
    const lastParamsRef = useRef<{ amount: number; currency: string; customerEmail?: string }>()

    useEffect(() => {
      if (!stripePromise) {
        onError?.(
          "Stripe publishable key is missing. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.",
        )
        return
      }

      const hasChanged =
        !lastParamsRef.current ||
        lastParamsRef.current.amount !== amount ||
        lastParamsRef.current.currency !== currency ||
        lastParamsRef.current.customerEmail !== customerEmail

      if (!hasChanged && clientSecret) {
        return
      }

      let isMounted = true
      setIsLoading(true)
      onError?.(null)

      fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, currency, customerEmail }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data?.message || "Unable to initialise Stripe payment.")
          }
          return response.json() as Promise<{
            clientSecret?: string
            paymentIntentId?: string
          }>
        })
        .then((data) => {
          if (!isMounted) return
          if (!data.clientSecret) {
            throw new Error("Stripe client secret is missing from response.")
          }
          setClientSecret(data.clientSecret)
          setPaymentIntentId(data.paymentIntentId ?? null)
          setInitialised(true)
          lastParamsRef.current = { amount, currency, customerEmail }
        })
        .catch((error: unknown) => {
          console.error("[STRIPE_PAYMENT_FORM_INIT_ERROR]", error)
          const message =
            error instanceof Error
              ? error.message
              : "Failed to initialise Stripe payment."
          onError?.(message)
          setInitialised(false)
          setClientSecret(null)
          setPaymentIntentId(null)
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false)
          }
        })

      return () => {
        isMounted = false
      }
    }, [amount, currency, customerEmail, stripePromise, onError, clientSecret])

    if (!publishableKey) {
      return (
        <div className="border border-red-500 bg-red-50 text-red-600 px-4 py-3 text-sm">
          Stripe publishable key is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
        </div>
      )
    }

    if (!stripePromise) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing Stripe...
        </div>
      )
    }

    if (!clientSecret || !initialised) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Loader2 className="h-4 w-4 animate-spin" /> Preparing secure payment form...
        </div>
      )
    }

    const appearance = {
      theme: "flat" as const,
      labels: "floating" as const,
      variables: {
        colorText: "#111111",
        fontFamily: "AdihausDIN, Helvetica, Arial, sans-serif",
        borderRadius: "0",
      },
    }

    return (
      <div className={cn("space-y-4", className)}>
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance }}
          key={clientSecret}
        >
          <StripePaymentElement
            ref={ref}
            paymentIntentId={paymentIntentId}
            onError={onError}
          />
        </Elements>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" /> Updating payment form...
          </div>
        )}
      </div>
    )
  },
)

type StripePaymentElementProps = {
  paymentIntentId: string | null
  onError?: (message: string | null) => void
}

const StripePaymentElement = forwardRef<StripePaymentFormHandle, StripePaymentElementProps>(
  function StripePaymentElement({ paymentIntentId, onError }, ref) {
    const stripe = useStripe()
    const elements = useElements()
    const [isConfirming, setIsConfirming] = useState(false)

    useImperativeHandle(ref, () => ({
      async confirmPayment() {
        if (!stripe || !elements) {
          throw new Error("Stripe has not finished loading yet. Please try again in a moment.")
        }

        setIsConfirming(true)
        onError?.(null)

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href,
          },
          redirect: "if_required",
        })

        setIsConfirming(false)

        if (error) {
          const message = error.message || "Card authorisation failed."
          onError?.(message)
          throw new Error(message)
        }

        const intentId = paymentIntent?.id ?? paymentIntentId
        if (!intentId) {
          const message = "Payment intent could not be confirmed."
          onError?.(message)
          throw new Error(message)
        }

        onError?.(null)

        return {
          paymentIntentId: intentId,
        }
      },
    }))

    return (
      <div className={cn("space-y-4", isConfirming && "opacity-70 pointer-events-none")}
      >
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
    )
  },
)

export default StripePaymentFormInner


