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

    const productsWithImages = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        // 1. Ảnh chính của product
        const productAttachments = await prisma.active_storage_attachments.findMany({
          where: {
            record_type: "Product",
            record_id: product.id,
          },
          orderBy: { id: "asc" },
          select: {
            active_storage_blobs: {
              select: { key: true },
            },
          },
        })

        const productImages = productAttachments.map(att => {
          const key = att.active_storage_blobs?.key
          return key ? `https://res.cloudinary.com/dq7vadalc/image/upload/${key}` : null
        }).filter(Boolean)

        // 2. Variants & ảnh
        const variants = await prisma.variants.findMany({
          where: { product_id: product.id },
          // include: {
          //   sizes: {
          //     select: { label: true }
          //   }
          // }
        })

        const enrichedVariants = await Promise.all(variants.map(async (variant) => {
          // Ảnh của từng variant
          const variantAttachments = await prisma.active_storage_attachments.findMany({
            where: {
              record_type: "Variant",
              record_id: variant.id,
            },
            orderBy: { id: "asc" },
            select: {
              active_storage_blobs: {
                select: { key: true },
              },
            },
          })

          const image_urls = variantAttachments.map(att => {
            const key = att.active_storage_blobs?.key
            return key ? `https://res.cloudinary.com/dq7vadalc/image/upload/${key}` : null
          }).filter(Boolean)

          return {
            id: variant.id,
            variant_code: variant.variant_code,
            color: variant.color,
            price: variant.price,
            compare_at_price: variant.compare_at_price,
            stock: variant.stock,
            product_id: variant.product_id,
            created_at: variant.created_at,
            updated_at: variant.updated_at,
            // sizes: variant.sizes.map(s => s.label).filter(Boolean),
            avatar_url: image_urls[0] || "/placeholder.svg?height=300&width=250",
            images: image_urls,
          }
        }))

        const firstVariant = enrichedVariants[0]

        return {
          ...product,
          price: firstVariant?.price ?? null,
          compare_at_price: firstVariant?.compare_at_price ?? null,
          image_url: productImages[0] ?? "/placeholder.svg?height=300&width=250",
          hover_image_url: productImages[1] ?? "/placeholder.svg?height=300&width=250",
          variants: enrichedVariants,
        }
      })
    )

    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null

    return Response.json(
      serializeBigInt({
        products: productsWithImages,
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
