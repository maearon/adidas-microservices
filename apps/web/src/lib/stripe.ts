import "server-only"

import Stripe from "stripe"

// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("STRIPE_SECRET_KEY environment variable is not set")
// }

if (!process.env.STRIPE_SECRET_KEY) {
  if (process.env.NODE_ENV === "production") {
    // throw new Error("STRIPE_SECRET_KEY environment variable is not set")
    console.warn("⚠️ STRIPE_SECRET_KEY missing, skipping Stripe init")
  } else {
    console.warn("⚠️ STRIPE_SECRET_KEY missing, skipping Stripe init")
  }
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key_for_build")