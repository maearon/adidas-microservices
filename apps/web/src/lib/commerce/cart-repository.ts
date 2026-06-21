import prisma from "@/lib/prisma"
import { enrichCartLines } from "@/lib/commerce/enrich-line-items"
import type { StoredCartLine } from "@/lib/commerce/types"

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
