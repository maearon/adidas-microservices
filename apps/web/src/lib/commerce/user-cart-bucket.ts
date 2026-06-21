import { createHash } from "crypto"

/** Stable bigint bucket for cart_items.cart_id — works with any Better Auth user id string. */
export function userCartBucketId(userId: string): bigint {
  const digest = createHash("sha256").update(userId).digest()
  let bucket = 0n
  for (let i = 0; i < 7; i++) {
    bucket = (bucket << 8n) | BigInt(digest[i]!)
  }
  return bucket
}
