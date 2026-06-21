export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/utils/getUserFromRequest"
import { serializeBigInt } from "@/lib/bigint"
import {
  clearGuestCart,
  getGuestCartItems,
  getOrCreateGuestCart,
  getUserCartItems,
  mergeStoredCartLines,
  removeGuestCartItem,
  removeUserCartItem,
  replaceUserCartLines,
  syncUserCartOnLogin,
  upsertGuestCartItem,
  upsertUserCartItem,
} from "@/lib/commerce/cart-repository"
import type { SyncPayload } from "@/lib/commerce/types"

export async function GET(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)

    if (userId) {
      const items = await getUserCartItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    const guestCartId = req.nextUrl.searchParams.get("guestCartId")
    if (!guestCartId) {
      return NextResponse.json(serializeBigInt({ items: [] }))
    }

    const cart = await getOrCreateGuestCart(guestCartId)
    const items = await getGuestCartItems(cart.id)

    return NextResponse.json(
      serializeBigInt({
        guestCartId: String(cart.id),
        items,
      }),
    )
  } catch (error) {
    console.error("GET /api/cart", error)
    return NextResponse.json({ message: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const body = await req.json()

    if (userId) {
      await upsertUserCartItem({
        userId,
        productId: BigInt(body.productId),
        variantId: BigInt(body.variantId),
        quantity: Number(body.quantity ?? 1),
        size: body.size,
      })
      const items = await getUserCartItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    const cart = await getOrCreateGuestCart(body.guestCartId)
    await upsertGuestCartItem({
      guestCartId: cart.id,
      productId: BigInt(body.productId),
      variantId: BigInt(body.variantId),
      quantity: Number(body.quantity ?? 1),
      size: body.size,
    })

    const items = await getGuestCartItems(cart.id)
    return NextResponse.json(serializeBigInt({ guestCartId: String(cart.id), items }))
  } catch (error) {
    console.error("POST /api/cart", error)
    return NextResponse.json({ message: "Failed to update cart" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const body = (await req.json()) as SyncPayload

    if (userId) {
      await syncUserCartOnLogin(userId, body.guestCartId, body.cartLines ?? [], {
        fullReplace: body.fullReplace,
      })
      const items = await getUserCartItems(userId)
      return NextResponse.json(serializeBigInt({ items, synced: true }))
    }

    const cart = await getOrCreateGuestCart(body.guestCartId)
    if (body.cartLines?.length) {
      await mergeStoredCartLines(cart.id, body.cartLines)
    }

    const items = await getGuestCartItems(cart.id)
    return NextResponse.json(
      serializeBigInt({
        guestCartId: String(cart.id),
        items,
      }),
    )
  } catch (error) {
    console.error("PUT /api/cart", error)
    return NextResponse.json({ message: "Failed to sync cart" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = await getUserFromRequest(req)
    const guestCartId = req.nextUrl.searchParams.get("guestCartId")
    const variantId = req.nextUrl.searchParams.get("variantId")

    if (userId) {
      if (variantId) {
        await removeUserCartItem(userId, BigInt(variantId))
      } else if (req.nextUrl.searchParams.get("replace") === "true") {
        await replaceUserCartLines(userId, [])
      }
      const items = await getUserCartItems(userId)
      return NextResponse.json(serializeBigInt({ items }))
    }

    if (!guestCartId) {
      return NextResponse.json({ message: "guestCartId required" }, { status: 400 })
    }

    if (variantId) {
      await removeGuestCartItem(BigInt(guestCartId), BigInt(variantId))
    } else {
      await clearGuestCart(BigInt(guestCartId))
    }

    const items = await getGuestCartItems(BigInt(guestCartId))
    return NextResponse.json(serializeBigInt({ guestCartId, items }))
  } catch (error) {
    console.error("DELETE /api/cart", error)
    return NextResponse.json({ message: "Failed to delete cart item" }, { status: 500 })
  }
}
