// app/api/products/[slug]/[variant_code]/route.ts
// app/api/products/[slug]/[variant_code]/route.ts
import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { serializeBigInt } from "@/lib/bigint"
import { getImageUrlsByRecord } from "@/lib/attachments"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: { variant_code: string } }) {
  const variant_code = params.variant_code

  if (!variant_code) {
    return Response.json({ error: "Missing variant_code" }, { status: 404 })
  }

  try {
    const variant = await prisma.variants.findFirst({
      where: { variant_code },
      include: {
        products: {
          include: {
            products_tags: {
              include: {
                tags: { select: { name: true } },
              },
            },
            categories: { select: { name: true } },
          },
        },
        variant_sizes: {
          include: {
            sizes: true,
          },
        },
      },
    })

    if (!variant || !variant.products) {
      return Response.json({ error: "Variant or product not found" }, { status: 404 })
    }

    const product = variant.products

    // Lấy ảnh sản phẩm từ ActiveStorage
    const productImages = await getImageUrlsByRecord("Product", product.id)
    const mainImage = productImages[0] ?? "/placeholder.svg"
    const hoverImage = productImages[1] ?? "/placeholder.svg"

    // Lấy tất cả variants thuộc product
    const productVariants = await prisma.variants.findMany({
      where: { product_id: product.id },
      include: {
        variant_sizes: {
          include: { sizes: true },
        },
      },
    })

    const enrichedVariants = await Promise.all(
      productVariants.map(async (v) => {
        const variantImages = await getImageUrlsByRecord("Variant", v.id)
        return {
          id: v.id,
          color: v.color,
          price: v.price,
          compare_at_price: v.compare_at_price,
          variant_code: v.variant_code,
          category: product.categories?.name ?? "",
          stock: v.stock,
          sizes: v.variant_sizes.map(vs => vs.sizes.label),
          product_id: v.product_id,
          created_at: v.created_at,
          updated_at: v.updated_at,
          avatar_url: variantImages[0] ?? "/placeholder.svg?height=300&width=250",
          image_urls: variantImages,
          image_url: mainImage,
          hover_image_url: hoverImage,
        }
      })
    )

    // Lấy sản phẩm liên quan
    const relatedProducts = await prisma.products.findMany({
      where: {
        id: { not: product.id },
        gender: product.gender,
        category: product.category,
        sport: product.sport,
      },
      take: 4,
      include: {
        variants: { take: 1 },
      },
    })

    let fallbackProducts: typeof relatedProducts = []
    if (relatedProducts.length < 4) {
      fallbackProducts = await prisma.products.findMany({
        where: {
          id: { notIn: [product.id, ...relatedProducts.map((p) => p.id)] },
          category: product.category,
        },
        take: 4 - relatedProducts.length,
        include: {
          variants: { take: 1 },
        },
      })
    }

    return Response.json(
      serializeBigInt({
        id: product.id,
        name: product.name,
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
        tags: product.products_tags.map(pt => pt.tags.name),
        variant_code: variant.variant_code,
        title: product.name,
        slug: product.slug,
        currencyId: "USD",
        currencyFormat: "$",
        isFreeShipping: true,
        main_image_url: mainImage,
        hover_image_url: hoverImage,
        variants: enrichedVariants,
        related_products: await Promise.all(
          [...relatedProducts, ...fallbackProducts].map(async (p) => {
            const [image] = await getImageUrlsByRecord("Product", p.id)
            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              model_number: p.model_number,
              price: p.variants[0]?.price ?? 0,
              image_url: image ?? "/placeholder.svg",
            }
          })
        ),
        breadcrumb: [],
      })
    )
  } catch (err) {
    console.error("GET /products/[slug]/[variant_code] error:", err)
    return Response.json({ error: "Not found" }, { status: 404 })
  }
}
