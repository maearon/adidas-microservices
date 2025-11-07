import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"

type StripeCheckoutItem = {
  name: string
  description?: string
  image?: string
  price: number
  quantity: number
}

type StripeCheckoutRequestBody = {
  orderId: string
  items: StripeCheckoutItem[]
  currency?: string
  customerEmail?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as StripeCheckoutRequestBody
    const { orderId, items, customerEmail, currency = "usd" } = body

    if (!orderId) {
      return NextResponse.json(
        { message: "Missing orderId" },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: "No line items provided" },
        { status: 400 }
      )
    }

    const origin = req.headers.get("origin") ?? process.env.APP_BASE_URL ?? "http://localhost:3001"

    const lineItems = items.map((item) => {
      if (!item.price || item.price <= 0) {
        throw new Error(`Invalid price for item: ${item.name ?? "Unknown"}`)
      }

      return {
        quantity: item.quantity,
        price_data: {
          currency,
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            description: item.description,
            images: item.image ? [item.image] : undefined,
          },
        },
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
      line_items: lineItems,
      success_url: `${origin}/order-confirmation?orderId=${orderId}&payment=stripe&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?orderId=${orderId}&canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["US", "VN", "CA", "GB", "SG", "AU"],
      },
      billing_address_collection: "required",
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error)
    const message = error instanceof Error ? error.message : "Failed to create Stripe checkout session"
    return NextResponse.json({ message }, { status: 500 })
  }
}