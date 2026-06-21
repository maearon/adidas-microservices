export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server"
import { serializeBigInt } from "@/lib/bigint"
import { getRelatedProducts, getTopPickProducts } from "@/lib/commerce/recommendations"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const strategy = req.nextUrl.searchParams.get("strategy") ?? "top-picks"
    const productIdParam = req.nextUrl.searchParams.get("productId")
    const limit = Number(req.nextUrl.searchParams.get("limit") ?? 12)
    const category = req.nextUrl.searchParams.get("category")

    let productMeta: { id?: bigint; category?: string | null; gender?: string | null; sport?: string | null } =
      {}

    if (productIdParam) {
      const product = await prisma.products.findUnique({
        where: { id: BigInt(productIdParam) },
        select: { id: true, category: true, gender: true, sport: true },
      })
      if (product) {
        productMeta = product
      }
    }

    const products =
      strategy === "top-picks"
        ? await getTopPickProducts({ category, limit })
        : await getRelatedProducts({
            productId: productMeta.id ?? null,
            category: productMeta.category ?? category,
            gender: productMeta.gender ?? null,
            sport: productMeta.sport ?? null,
            limit,
            strategy: strategy as "related" | "complete-look" | "also-like" | "top-picks",
          })

    return NextResponse.json(serializeBigInt({ products }))
  } catch (error) {
    console.error("GET /api/products/recommendations", error)
    return NextResponse.json({ message: "Failed to fetch recommendations" }, { status: 500 })
  }
}
