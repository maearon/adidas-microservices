// /app/api/search/route.ts

import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { getProductSearchSelect } from "@/lib/types"
import { serializeBigInt } from "@/lib/bigint"

export const dynamic = 'force-dynamic'

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
          search: searchQuery, // maps to to_tsquery in PostgreSQL
        },
      },
      select: getProductSearchSelect(),
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: BigInt(cursor) }, skip: 1 } : {}),
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



// SELECT indexname, indexdef
// FROM pg_indexes
// WHERE tablename = 'products';

// CREATE INDEX index_products_on_lower_name
// ON products (LOWER(name));

// CREATE INDEX index_products_on_name_fts
// ON products USING GIN (to_tsvector('simple', name));

// CREATE EXTENSION IF NOT EXISTS pg_trgm;

// CREATE INDEX product_name_trgm_idx ON "products" USING GIN (name gin_trgm_ops);
// CREATE INDEX product_desc_trgm_idx ON "products" USING GIN (description_p gin_trgm_ops);
