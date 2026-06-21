import prisma from "@/lib/prisma"
import { enrichCartLines } from "@/lib/commerce/enrich-line-items"
import { userIdToLegacyBigInt } from "@/lib/commerce/user-id"
import type { StoredCartLine } from "@/lib/commerce/types"

/** Legacy Rails cart_items.cart_id (BigInt) — mapped from Better Auth user id */
function getUserCartItemCartId(userId: string) {
  return userIdToLegacyBigInt(userId)
}

export async function getOrCreateUserCartRecord(userId: string) {
  const existing = await prisma.carts.findFirst({
    where: { user_id: userId },
  })
  if (existing) return existing

  const now = new Date()
  return prisma.carts.create({
    data: {
      user_id: userId,
      created_at: now,
      updated_at: now,
    },
  })
}

export async function deleteGuestCart(guestCartId: bigint) {
  await prisma.guest_cart_items.deleteMany({
    where: { guest_cart_id: guestCartId },
  })
  await prisma.guest_carts.delete({ where: { id: guestCartId } })
}

export async function mergeGuestCartIntoUserCart(userId: string, guestCartId: bigint) {
  await getOrCreateUserCartRecord(userId)
  const cartId = getUserCartItemCartId(userId)
  const guestItems = await prisma.guest_cart_items.findMany({
    where: { guest_cart_id: guestCartId },
  })

  for (const item of guestItems) {
    const existing = await prisma.cart_items.findFirst({
      where: {
        cart_id: cartId,
        variant_id: item.variant_id,
        size: item.size ?? null,
      },
    })

    const now = new Date()
    if (existing) {
      await prisma.cart_items.update({
        where: { id: existing.id },
        data: {
          quantity: (existing.quantity ?? 0) + (item.quantity ?? 1),
          updated_at: now,
        },
      })
    } else {
      await prisma.cart_items.create({
        data: {
          cart_id: cartId,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity ?? 1,
          size: item.size,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }

  await deleteGuestCart(guestCartId)
}

export async function replaceUserCartLines(userId: string, lines: StoredCartLine[]) {
  await getOrCreateUserCartRecord(userId)
  const cartId = getUserCartItemCartId(userId)
  const variantIds = lines.map((line) => BigInt(line.variantId))

  if (!variantIds.length) {
    await prisma.cart_items.deleteMany({ where: { cart_id: cartId } })
    return
  }

  await prisma.cart_items.deleteMany({
    where: {
      cart_id: cartId,
      variant_id: { notIn: variantIds },
    },
  })

  const now = new Date()
  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.cart_items.findFirst({
      where: {
        cart_id: cartId,
        variant_id: variantId,
        size: line.size ?? null,
      },
    })

    if (existing) {
      await prisma.cart_items.update({
        where: { id: existing.id },
        data: {
          quantity: line.quantity,
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

export async function mergeStoredLinesIntoUserCart(userId: string, lines: StoredCartLine[]) {
  if (!lines.length) return

  await getOrCreateUserCartRecord(userId)
  const cartId = getUserCartItemCartId(userId)
  const now = new Date()

  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.cart_items.findFirst({
      where: {
        cart_id: cartId,
        variant_id: variantId,
        size: line.size ?? null,
      },
    })

    if (existing) {
      await prisma.cart_items.update({
        where: { id: existing.id },
        data: {
          quantity: line.quantity,
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

export async function syncUserCartOnLogin(
  userId: string,
  guestCartId: string | null | undefined,
  lines: StoredCartLine[],
  options?: { fullReplace?: boolean },
) {
  if (options?.fullReplace) {
    await replaceUserCartLines(userId, lines)
    return
  }

  if (guestCartId) {
    await mergeGuestCartIntoUserCart(userId, BigInt(guestCartId))
  }

  if (lines.length > 0) {
    await mergeStoredLinesIntoUserCart(userId, lines)
  }
}

export async function getUserCartItems(userId: string) {
  const cartId = getUserCartItemCartId(userId)
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

export async function upsertUserCartItem(params: {
  userId: string
  productId: bigint
  variantId: bigint
  quantity: number
  size?: string
}) {
  await getOrCreateUserCartRecord(params.userId)
  const cartId = getUserCartItemCartId(params.userId)
  const existing = await prisma.cart_items.findFirst({
    where: {
      cart_id: cartId,
      variant_id: params.variantId,
      size: params.size ?? null,
    },
  })

  const now = new Date()
  if (existing) {
    await prisma.cart_items.update({
      where: { id: existing.id },
      data: { quantity: params.quantity, updated_at: now },
    })
    return existing.id
  }

  const created = await prisma.cart_items.create({
    data: {
      cart_id: cartId,
      product_id: params.productId,
      variant_id: params.variantId,
      quantity: params.quantity,
      size: params.size ?? null,
      created_at: now,
      updated_at: now,
    },
  })
  return created.id
}

export async function removeUserCartItem(userId: string, variantId: bigint) {
  const cartId = getUserCartItemCartId(userId)
  await prisma.cart_items.deleteMany({
    where: { cart_id: cartId, variant_id: variantId },
  })
}

export async function getOrCreateGuestCart(guestCartId?: string | null) {
  if (guestCartId) {
    const existing = await prisma.guest_carts.findUnique({
      where: { id: BigInt(guestCartId) },
      include: { guest_cart_items: true },
    })
    if (existing) return existing
  }

  const now = new Date()
  return prisma.guest_carts.create({
    data: { created_at: now, updated_at: now },
    include: { guest_cart_items: true },
  })
}

export async function mergeStoredCartLines(
  guestCartId: bigint,
  lines: StoredCartLine[],
) {
  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.guest_cart_items.findFirst({
      where: { guest_cart_id: guestCartId, variant_id: variantId },
    })

    if (existing) {
      await prisma.guest_cart_items.update({
        where: { id: existing.id },
        data: {
          quantity: (existing.quantity ?? 0) + line.quantity,
          size: line.size ?? existing.size,
          updated_at: new Date(),
        },
      })
    } else {
      const now = new Date()
      await prisma.guest_cart_items.create({
        data: {
          guest_cart_id: guestCartId,
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

export async function getGuestCartItems(guestCartId: bigint) {
  const rows = await prisma.guest_cart_items.findMany({
    where: { guest_cart_id: guestCartId },
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

export async function upsertGuestCartItem(params: {
  guestCartId: bigint
  productId: bigint
  variantId: bigint
  quantity: number
  size?: string
}) {
  const existing = await prisma.guest_cart_items.findFirst({
    where: {
      guest_cart_id: params.guestCartId,
      variant_id: params.variantId,
      size: params.size ?? null,
    },
  })

  const now = new Date()

  if (existing) {
    await prisma.guest_cart_items.update({
      where: { id: existing.id },
      data: {
        quantity: params.quantity,
        updated_at: now,
      },
    })
    return existing.id
  }

  const created = await prisma.guest_cart_items.create({
    data: {
      guest_cart_id: params.guestCartId,
      product_id: params.productId,
      variant_id: params.variantId,
      quantity: params.quantity,
      size: params.size ?? null,
      created_at: now,
      updated_at: now,
    },
  })

  return created.id
}

export async function removeGuestCartItem(guestCartId: bigint, variantId: bigint) {
  await prisma.guest_cart_items.deleteMany({
    where: { guest_cart_id: guestCartId, variant_id: variantId },
  })
}

export async function clearGuestCart(guestCartId: bigint) {
  await prisma.guest_cart_items.deleteMany({
    where: { guest_cart_id: guestCartId },
  })
}
