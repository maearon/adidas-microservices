export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { serializeBigInt } from "@/lib/bigint"
import {
  getUserCartItems,
  removeUserCartItem,
  replaceUserCartLines,
  syncUserCart,
} from "@/lib/commerce/cart-repository"
import type { SyncPayload } from "@/lib/commerce/types"

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const items = await getUserCartItems(session.user.id)
    return NextResponse.json(serializeBigInt({ items }))
  } catch (error) {
    console.error("GET /api/cart", error)
    return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const userId = session.user.id
    const body = (await req.json()) as SyncPayload
    await syncUserCart(userId, body.cartLines ?? [], {
      fullReplace: body.fullReplace,
    })
    const items = await getUserCartItems(userId)
    return NextResponse.json(serializeBigInt({ items, synced: true }))
  } catch (error) {
    console.error("PUT /api/cart", error)
    return NextResponse.json({ message: "Failed to sync cart" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) return unauthorized()

    const userId = session.user.id
    const variantId = req.nextUrl.searchParams.get("variantId")

    if (variantId) {
      await removeUserCartItem(userId, BigInt(variantId))
    } else if (req.nextUrl.searchParams.get("replace") === "true") {
      await replaceUserCartLines(userId, [])
    }

    const items = await getUserCartItems(userId)
    return NextResponse.json(serializeBigInt({ items }))
  } catch (error) {
    console.error("DELETE /api/cart", error)
    return NextResponse.json({ message: "Failed to delete cart item" }, { status: 500 })
  }
}
