// /app/api/search/route.ts

import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
// import { getProductSearchSelect } from "@/lib/types"
import { serializeBigInt } from "@/lib/bigint"
import { getImageUrlsByRecord } from "@/lib/attachments"

export const dynamic = "force-dynamic"

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

    // ✅ Count total
    const totalCount = await prisma.products.count({
      where: { name: { search: searchQuery } },
    })

    // ✅ Query products
    const products = await prisma.products.findMany({
      where: {
        name: {
          search: searchQuery, // maps to to_tsquery in PostgreSQL
        },
      },
      // select: getProductSearchSelect(),
      include: {
        categories: { select: { name: true } },
        products_tags: {
          include: { tags: { select: { name: true } } },
        },
      },
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: BigInt(cursor) }, skip: 1 } : {}),
    })

    // ✅ Enrich products
    const enrichedProducts = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        // Ảnh product
        const [mainImage, hoverImage] = await Promise.all([
          getImageUrlsByRecord("Product", product.id, "image"),
          getImageUrlsByRecord("Product", product.id, "hover_image"),
        ])

        // Variants
        const variants = await prisma.variants.findMany({
          where: { product_id: product.id },
          include: { variant_sizes: { include: { sizes: true } } },
        })

        const variantImageResults = await Promise.all(
          variants.map(async (v) => {
            const [images, avatar, hover] = await Promise.all([
              getImageUrlsByRecord("Variant", v.id, "images"),
              getImageUrlsByRecord("Variant", v.id, "avatar"),
              getImageUrlsByRecord("Variant", v.id, "hover"),
            ])
            return { v, images, avatar, hover }
          })
        )

        const enrichedVariants = variantImageResults.map(({ v, images, avatar, hover }) => ({
          id: v.id,
          variant_code: v.variant_code,
          color: v.color,
          price: v.price,
          compare_at_price: v?.compare_at_price,
          stock: v.stock,
          product_id: v.product_id,
          created_at: v.created_at,
          updated_at: v.updated_at,
          sizes: v.variant_sizes.map((vs) => vs.sizes.label),
          avatar_url: avatar[0] ?? "/placeholder.svg?height=300&width=250",
          hover_url: hover[0] ?? "/placeholder.svg?height=300&width=250",
          image_urls: images ?? [],
        }))

        const firstVariant = enrichedVariants[0]

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          model_number: product.model_number,
          gender: product.gender,
          franchise: product.franchise,
          product_type: product.product_type,
          brand: product.brand,
          sport: product.sport,
          description_h5: product.description_h5,
          description_p: product.description_p,
          specifications: product.specifications,
          care: product.care,
          created_at: product.created_at,
          updated_at: product.updated_at,
          category: product.categories?.name ?? "",
          tags: product.products_tags.map((pt) => pt.tags.name),
          price: firstVariant?.price ?? null,
          compare_at_price: firstVariant?.compare_at_price ?? null,
          main_image_url: mainImage[0] ?? "/placeholder.svg?height=300&width=250",
          hover_image_url: hoverImage[0] ?? "/placeholder.svg?height=300&width=250",
          variants: enrichedVariants,
          currencyId: "USD",
          currencyFormat: "$",
          isFreeShipping: true,
        }
      })
    )

    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null

    return Response.json(
      serializeBigInt({
        products: enrichedProducts,
        nextCursor,
        totalCount,
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
