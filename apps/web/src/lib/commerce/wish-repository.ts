import prisma from "@/lib/prisma"
import { enrichWishLines } from "@/lib/commerce/enrich-line-items"
import { userIdToLegacyBigInt } from "@/lib/commerce/user-id"
import type { StoredWishLine } from "@/lib/commerce/types"

export async function getOrCreateGuestWish(guestWishId?: string | null) {
  if (guestWishId) {
    const existing = await prisma.guest_wishes.findUnique({
      where: { id: BigInt(guestWishId) },
      include: { guest_wish_items: true },
    })
    if (existing) return existing
  }

  const now = new Date()
  return prisma.guest_wishes.create({
    data: { created_at: now, updated_at: now },
    include: { guest_wish_items: true },
  })
}

export async function getOrCreateUserWish(userId: string) {
  const legacyUserId = userIdToLegacyBigInt(userId)
  let wish = await prisma.wishes.findFirst({
    where: { user_id: legacyUserId },
    include: { wish_items: true },
  })

  if (!wish) {
    const now = new Date()
    wish = await prisma.wishes.create({
      data: {
        user_id: legacyUserId,
        created_at: now,
        updated_at: now,
      },
      include: { wish_items: true },
    })
  }

  return wish
}

export async function mergeGuestWishIntoUserWish(
  userId: string,
  guestWishId: bigint,
) {
  const userWish = await getOrCreateUserWish(userId)
  const guestItems = await prisma.guest_wish_items.findMany({
    where: { guest_wish_id: guestWishId },
  })

  for (const item of guestItems) {
    const existing = await prisma.wish_items.findFirst({
      where: {
        wish_id: userWish.id,
        variant_id: item.variant_id,
      },
    })

    if (!existing) {
      const now = new Date()
      await prisma.wish_items.create({
        data: {
          wish_id: userWish.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }

  await prisma.guest_wish_items.deleteMany({
    where: { guest_wish_id: guestWishId },
  })
  await prisma.guest_wishes.delete({ where: { id: guestWishId } })
  return userWish
}

export async function replaceUserWishLines(userId: string, lines: StoredWishLine[]) {
  const wish = await getOrCreateUserWish(userId)
  const variantIds = lines.map((line) => BigInt(line.variantId))

  if (!variantIds.length) {
    await prisma.wish_items.deleteMany({ where: { wish_id: wish.id } })
    return wish
  }

  await prisma.wish_items.deleteMany({
    where: {
      wish_id: wish.id,
      variant_id: { notIn: variantIds },
    },
  })

  const now = new Date()
  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.wish_items.findFirst({
      where: { wish_id: wish.id, variant_id: variantId },
    })

    if (!existing) {
      await prisma.wish_items.create({
        data: {
          wish_id: wish.id,
          product_id: productId,
          variant_id: variantId,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }

  return wish
}

export async function mergeStoredLinesIntoUserWish(userId: string, lines: StoredWishLine[]) {
  if (!lines.length) return

  const wish = await getOrCreateUserWish(userId)
  const now = new Date()

  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.wish_items.findFirst({
      where: { wish_id: wish.id, variant_id: variantId },
    })

    if (!existing) {
      await prisma.wish_items.create({
        data: {
          wish_id: wish.id,
          product_id: productId,
          variant_id: variantId,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }
}

export async function syncUserWishOnLogin(
  userId: string,
  guestWishId: string | null | undefined,
  lines: StoredWishLine[],
  options?: { fullReplace?: boolean },
) {
  if (options?.fullReplace) {
    await replaceUserWishLines(userId, lines)
    return
  }

  if (guestWishId) {
    await mergeGuestWishIntoUserWish(userId, BigInt(guestWishId))
  }

  if (lines.length > 0) {
    await mergeStoredLinesIntoUserWish(userId, lines)
  }
}

export async function mergeStoredWishLines(userId: string, lines: StoredWishLine[]) {
  const wish = await getOrCreateUserWish(userId)
  const now = new Date()

  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.wish_items.findFirst({
      where: { wish_id: wish.id, variant_id: variantId },
    })

    if (!existing) {
      await prisma.wish_items.create({
        data: {
          wish_id: wish.id,
          product_id: productId,
          variant_id: variantId,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }

  return wish
}

export async function mergeStoredLinesIntoGuestWish(
  guestWishId: bigint,
  lines: StoredWishLine[],
) {
  const now = new Date()

  for (const line of lines) {
    const variantId = BigInt(line.variantId)
    const productId = BigInt(line.productId)
    const existing = await prisma.guest_wish_items.findFirst({
      where: { guest_wish_id: guestWishId, variant_id: variantId },
    })

    if (!existing) {
      await prisma.guest_wish_items.create({
        data: {
          guest_wish_id: guestWishId,
          product_id: productId,
          variant_id: variantId,
          created_at: now,
          updated_at: now,
        },
      })
    }
  }
}

export async function getUserWishItems(userId: string) {
  const wish = await getOrCreateUserWish(userId)
  const rows = await prisma.wish_items.findMany({
    where: { wish_id: wish.id },
    orderBy: { updated_at: "desc" },
  })

  return enrichWishLines(rows.map((row) => ({ variantId: row.variant_id })))
}

export async function getGuestWishItems(guestWishId: bigint) {
  const rows = await prisma.guest_wish_items.findMany({
    where: { guest_wish_id: guestWishId },
    orderBy: { updated_at: "desc" },
  })

  return enrichWishLines(rows.map((row) => ({ variantId: row.variant_id })))
}

export async function addUserWishItem(params: {
  userId: string
  productId: bigint
  variantId: bigint
}) {
  const wish = await getOrCreateUserWish(params.userId)
  const existing = await prisma.wish_items.findFirst({
    where: { wish_id: wish.id, variant_id: params.variantId },
  })

  if (existing) return existing.id

  const now = new Date()
  const created = await prisma.wish_items.create({
    data: {
      wish_id: wish.id,
      product_id: params.productId,
      variant_id: params.variantId,
      created_at: now,
      updated_at: now,
    },
  })

  return created.id
}

export async function addGuestWishItem(params: {
  guestWishId: bigint
  productId: bigint
  variantId: bigint
}) {
  const existing = await prisma.guest_wish_items.findFirst({
    where: {
      guest_wish_id: params.guestWishId,
      variant_id: params.variantId,
    },
  })

  if (existing) return existing.id

  const now = new Date()
  const created = await prisma.guest_wish_items.create({
    data: {
      guest_wish_id: params.guestWishId,
      product_id: params.productId,
      variant_id: params.variantId,
      created_at: now,
      updated_at: now,
    },
  })

  return created.id
}

export async function removeUserWishItem(userId: string, variantId: bigint) {
  const wish = await getOrCreateUserWish(userId)
  await prisma.wish_items.deleteMany({
    where: { wish_id: wish.id, variant_id: variantId },
  })
}

export async function removeGuestWishItem(guestWishId: bigint, variantId: bigint) {
  await prisma.guest_wish_items.deleteMany({
    where: { guest_wish_id: guestWishId, variant_id: variantId },
  })
}
