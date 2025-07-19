import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getProductSearchSelect } from "@/lib/types"
import { serializeBigInt } from "@/lib/bigint"

export const dynamic = "force-dynamic" // ✅ Fix lỗi build trên Vercel

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || ""
    const cursor = req.nextUrl.searchParams.get("cursor")
    const pageSize = 10

    const searchQuery = q
      .trim()
      .split(/\s+/)
      .map((word) => word + ":*")
      .join(" & ")

    const products = await prisma.products.findMany({
      where: {
        name: {
          search: searchQuery,
        },
      },
      select: getProductSearchSelect(),
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor && /^\d+$/.test(cursor)
        ? { cursor: { id: BigInt(cursor) }, skip: 1 }
        : {}),
    })

    const productsWithAssets = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        const imageAttachments = await prisma.active_storage_attachments.findMany({
          where: {
            record_type: "Product",
            record_id: product.id,
          },
          select: {
            blob_id: true,
            active_storage_blobs: {
              select: {
                key: true,
                filename: true,
                content_type: true,
              },
            },
          },
        })

        const imageUrls = imageAttachments.map((att) => {
          const key = att.active_storage_blobs.key
          return `https://res.cloudinary.com/dq7vadalc/image/upload/${key}`
        })

        return {
          ...product,
          image_urls: imageUrls,
        }
      })
    )

    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null

    return Response.json(
      serializeBigInt({
        products: productsWithAssets,
        nextCursor,
      })
    )
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}