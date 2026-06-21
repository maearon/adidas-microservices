export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest"
import { serializeBigInt } from "@/lib/bigint"
import {
  addGuestWishItem,
  addUserWishItem,
  getGuestWishItems,
  getOrCreateGuestWish,
  getUserWishItems,
  mergeStoredLinesIntoGuestWish,
  removeGuestWishItem,
  removeUserWishItem,
  replaceUserWishLines,
  syncUserWishOnLogin,
} from "@/lib/commerce/wish-repository"
import type { SyncPayload } from "@/lib/commerce/types"

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)

    if (userId) {
      const items = await getUserWishItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    const guestWishId = req.nextUrl.searchParams.get("guestWishId")
    if (!guestWishId) {
      return NextResponse.json(serializeBigInt({ items: [] }))
    }

    const wish = await getOrCreateGuestWish(guestWishId)
    const items = await getGuestWishItems(wish.id)

    return NextResponse.json(
      serializeBigInt({
        guestWishId: String(wish.id),
        items,
      }),
    )
  } catch (error) {
    console.error("GET /api/wishlist", error)
    return NextResponse.json({ message: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const body = await req.json()

    if (userId) {
      await addUserWishItem({
        userId,
        productId: BigInt(body.productId),
        variantId: BigInt(body.variantId),
      })
      const items = await getUserWishItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    const wish = await getOrCreateGuestWish(body.guestWishId)
    await addGuestWishItem({
      guestWishId: wish.id,
      productId: BigInt(body.productId),
      variantId: BigInt(body.variantId),
    })
    const items = await getGuestWishItems(wish.id)
    return NextResponse.json(
      serializeBigInt({
        guestWishId: String(wish.id),
        items,
      }),
    )
  } catch (error) {
    console.error("POST /api/wishlist", error)
    return NextResponse.json({ message: "Failed to update wishlist" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const body = (await req.json()) as SyncPayload

    if (userId) {
      await syncUserWishOnLogin(userId, body.guestWishId, body.wishLines ?? [], {
        fullReplace: body.fullReplace,
      })
      const items = await getUserWishItems(userId)
      return NextResponse.json(serializeBigInt({ items, synced: true }))
    }

    const wish = await getOrCreateGuestWish(body.guestWishId)
    if (body.wishLines?.length) {
      await mergeStoredLinesIntoGuestWish(wish.id, body.wishLines)
    }
    const items = await getGuestWishItems(wish.id)
    return NextResponse.json(
      serializeBigInt({
        guestWishId: String(wish.id),
        items,
      }),
    )
  } catch (error) {
    console.error("PUT /api/wishlist", error)
    return NextResponse.json({ message: "Failed to sync wishlist" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const guestWishId = req.nextUrl.searchParams.get("guestWishId")
    const variantId = req.nextUrl.searchParams.get("variantId")

    if (!variantId) {
      return NextResponse.json({ message: "variantId required" }, { status: 400 })
    }

    if (userId) {
      await removeUserWishItem(userId, BigInt(variantId))
      const items = await getUserWishItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    if (!guestWishId) {
      return NextResponse.json({ message: "guestWishId required" }, { status: 400 })
    }

    await removeGuestWishItem(BigInt(guestWishId), BigInt(variantId))
    const items = await getGuestWishItems(BigInt(guestWishId))
    return NextResponse.json(serializeBigInt({ guestWishId, items }))
  } catch (error) {
    console.error("DELETE /api/wishlist", error)
    return NextResponse.json({ message: "Failed to delete wishlist item" }, { status: 500 })
  }
}
