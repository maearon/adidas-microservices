import prisma from "@/lib/prisma"
import { enrichWishLines } from "@/lib/commerce/enrich-line-items"
import type { StoredWishLine } from "@/lib/commerce/types"

async function getOrCreateUserWish(betterAuthUserId: string) {
  let wish = await prisma.wishes.findFirst({
    where: { user_id: betterAuthUserId },
    include: { wish_items: true },
  })

  if (!wish) {
    const now = new Date()
    wish = await prisma.wishes.create({
      data: { user_id: betterAuthUserId, created_at: now, updated_at: now },
      include: { wish_items: true },
    })
  }

  return wish
}

export async function replaceUserWishLines(betterAuthUserId: string, lines: StoredWishLine[]) {
  const wish = await getOrCreateUserWish(betterAuthUserId)
  const variantIds = lines.map((line) => BigInt(line.variantId))

  if (!variantIds.length) {
    await prisma.wish_items.deleteMany({ where: { wish_id: wish.id } })
    return wish
  }

  await prisma.wish_items.deleteMany({
    where: { wish_id: wish.id, variant_id: { notIn: variantIds } },
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

async function mergeStoredLinesIntoUserWish(betterAuthUserId: string, lines: StoredWishLine[]) {
  if (!lines.length) return

  const wish = await getOrCreateUserWish(betterAuthUserId)
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

export async function syncUserWish(
  betterAuthUserId: string,
  lines: StoredWishLine[],
  options?: { fullReplace?: boolean },
) {
  if (options?.fullReplace) {
    await replaceUserWishLines(betterAuthUserId, lines)
    return
  }

  await mergeStoredLinesIntoUserWish(betterAuthUserId, lines)
}

export async function getUserWishItems(betterAuthUserId: string) {
  const wish = await getOrCreateUserWish(betterAuthUserId)
  const rows = await prisma.wish_items.findMany({
    where: { wish_id: wish.id },
    orderBy: { updated_at: "desc" },
  })

  return enrichWishLines(rows.map((row) => ({ variantId: row.variant_id })))
}

export async function removeUserWishItem(betterAuthUserId: string, variantId: bigint) {
  const wish = await getOrCreateUserWish(betterAuthUserId)
  await prisma.wish_items.deleteMany({
    where: { wish_id: wish.id, variant_id: variantId },
  })
}
