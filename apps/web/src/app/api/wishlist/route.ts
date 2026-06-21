export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { serializeBigInt } from "@/lib/bigint"
import { getUserWishItems, removeUserWishItem, syncUserWish } from "@/lib/commerce/wish-repository"
import type { SyncPayload } from "@/lib/commerce/types"

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const items = await getUserWishItems(session.user.id)
    return NextResponse.json(serializeBigInt({ items }))
  } catch (error) {
    console.error("GET /api/wishlist", error)
    return NextResponse.json({ message: "Failed to fetch wishlist" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const userId = session.user.id
    const body = (await req.json()) as SyncPayload
    await syncUserWish(userId, body.wishLines ?? [], {
      fullReplace: body.fullReplace,
    })
    const items = await getUserWishItems(userId)
    return NextResponse.json(serializeBigInt({ items, synced: true }))
  } catch (error) {
    console.error("PUT /api/wishlist", error)
    return NextResponse.json({ message: "Failed to sync wishlist" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const userId = session.user.id
    const variantId = req.nextUrl.searchParams.get("variantId")
    if (!variantId) {
      return NextResponse.json({ message: "variantId required" }, { status: 400 })
    }

    await removeUserWishItem(userId, BigInt(variantId))
    const items = await getUserWishItems(userId)
    return NextResponse.json(serializeBigInt({ items }))
  } catch (error) {
    console.error("DELETE /api/wishlist", error)
    return NextResponse.json({ message: "Failed to delete wishlist item" }, { status: 500 })
  }
}
