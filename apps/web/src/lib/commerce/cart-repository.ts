import prisma from "@/lib/prisma"
import { enrichCartLines } from "@/lib/commerce/enrich-line-items"
import type { StoredCartLine } from "@/lib/commerce/types"

/** cart_items.cart_id is BigInt — stable bucket key from Better Auth user id (not a users FK). */
function cartItemsCartId(betterAuthUserId: string) {
  const hex = betterAuthUserId.replace(/-/g, "").slice(0, 16)
  return BigInt(`0x${hex}`)
}

async function getOrCreateUserCartRecord(betterAuthUserId: string) {
  const existing = await prisma.carts.findFirst({ where: { user_id: betterAuthUserId } })
  if (existing) return existing

  const now = new Date()
  return prisma.carts.create({
    data: { user_id: betterAuthUserId, created_at: now, updated_at: now },
  })
}

export async function replaceUserCartLines(betterAuthUserId: string, lines: StoredCartLine[]) {
  await getOrCreateUserCartRecord(betterAuthUserId)
  const cartId = cartItemsCartId(betterAuthUserId)
  const variantIds = lines.map((line) => BigInt(line.variantId))

  if (!variantIds.length) {
    await prisma.cart_items.deleteMany({ where: { cart_id: cartId } })
    return
  }

  await prisma.cart_items.deleteMany({
    where: { cart_id: cartId, variant_id: { notIn: variantIds } },
  })

  const now = new Date()
  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.cart_items.findFirst({
      where: { cart_id: cartId, variant_id: variantId, size: line.size ?? null },
    })

    if (existing) {
      await prisma.cart_items.update({
        where: { id: existing.id },
        data: { quantity: line.quantity, updated_at: now },
      })
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId,
          quantity: line.quantity,
          size: line.size ?? null,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }
}

async function mergeStoredLinesIntoUserCart(betterAuthUserId: string, lines: StoredCartLine[]) {
  if (!lines.length) return

  await getOrCreateUserCartRecord(betterAuthUserId)
  const cartId = cartItemsCartId(betterAuthUserId)
  const now = new Date()

  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.cart_items.findFirst({
      where: { cart_id: cartId, variant_id: variantId, size: line.size ?? null },
    })

    if (existing) {
      await prisma.cart_items.update({
        where: { id: existing.id },
        data: {
          quantity: (existing.quantity ?? 0) + line.quantity,
          updated_at: now,
        },
      })
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cartId,
          product_id: productId,
          variant_id: variantId,
          quantity: line.quantity,
          size: line.size ?? null,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }
}

export async function syncUserCart(
  betterAuthUserId: string,
  lines: StoredCartLine[],
  options?: { fullReplace?: boolean },
) {
  if (options?.fullReplace) {
    await replaceUserCartLines(betterAuthUserId, lines)
    return
  }

  await mergeStoredLinesIntoUserCart(betterAuthUserId, lines)
}

export async function getUserCartItems(betterAuthUserId: string) {
  const cartId = cartItemsCartId(betterAuthUserId)
  const rows = await prisma.cart_items.findMany({
    where: { cart_id: cartId },
    orderBy: { updated_at: "desc" },
  })

  return enrichCartLines(
    rows.map((row) => ({
      variantId: row.variant_id,
      quantity: row.quantity ?? 1,
      size: row.size,
    })),
  )
}

export async function removeUserCartItem(betterAuthUserId: string, variantId: bigint) {
  const cartId = cartItemsCartId(betterAuthUserId)
  await prisma.cart_items.deleteMany({
    where: { cart_id: cartId, variant_id: variantId },
  })
}
