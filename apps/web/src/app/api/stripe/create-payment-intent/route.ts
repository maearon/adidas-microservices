import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

type CreatePaymentIntentPayload = {
  amount: number
  currency?: string
  customerEmail?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreatePaymentIntentPayload
    const { amount, currency = "usd", customerEmail } = body

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: "Invalid amount for payment intent" },
        { status: 400 },
      )
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customerEmail,
      metadata: {
        source: "checkout_stripe_form",
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("[STRIPE_CREATE_PAYMENT_INTENT_ERROR]", error)
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create Stripe payment intent"
    return NextResponse.json({ message }, { status: 500 })
  }
}


