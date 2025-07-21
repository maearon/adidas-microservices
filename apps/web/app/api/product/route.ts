import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { serializeBigInt } from "@/lib/bigint"
import { getImageUrlsByRecord } from "@/lib/attachments"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const variant_code = req.nextUrl.searchParams.get("q") || ""
  // const { variant_code } = params
  if (!variant_code) {
    return Response.json({ error: "Missing variant_code" }, { status: 404 })
  }

  
    // ✅ Gộp toàn bộ product + variants + tags + categories + sizes vào 1 query
    const variant = await prisma.variants.findFirst({
      where: { variant_code },
      include: {
        variant_sizes: { include: { sizes: true } },
        products: {
          include: {
            variants: {
              include: {
                variant_sizes: { include: { sizes: true } },
              },
            },
            products_tags: {
              include: {
                tags: { select: { name: true } },
              },
            },
            categories: { select: { name: true } },
          },
        },
      },
    })

    if (!variant || !variant.products) {
      return Response.json({ error: "Variant or product not found" }, { status: 404 })
    }

    const product = variant.products

    // ✅ Lấy ảnh Product 1 lần
    const productImages = await getImageUrlsByRecord("Product", product.id)
    const mainImage = productImages[0] ?? "/placeholder.svg"
    const hoverImage = productImages[1] ?? "/placeholder.svg"

    // ✅ Lấy ảnh của tất cả variants song song
    const variantImageResults = await Promise.all(
      product.variants.map((v) => getImageUrlsByRecord("Variant", v.id))
    )

    const enrichedVariants = product.variants.map((v, i) => {
      const variantImages = variantImageResults[i]
      return {
        id: v.id,
        color: v.color,
        price: v.price,
        compare_at_price: v.compare_at_price,
        variant_code: v.variant_code,
        category: product.categories?.name ?? "",
        stock: v.stock,
        sizes: v.variant_sizes.map((vs) => vs.sizes.label),
        product_id: v.product_id,
        created_at: v.created_at,
        updated_at: v.updated_at,
        avatar_url: variantImages[0] ?? "/placeholder.svg?height=300&width=250",
        image_urls: variantImages,
        image_url: mainImage,
        hover_image_url: hoverImage,
      }
    })

    // ✅ Lấy sản phẩm liên quan (tối đa 4)
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

    // ✅ Fallback nếu thiếu
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

    // ✅ Lấy ảnh song song cho related products
    const allRelated = [...relatedProducts, ...fallbackProducts]
    const relatedImages = await Promise.all(
      allRelated.map((p) => getImageUrlsByRecord("Product", p.id))
    )

    const relatedData = allRelated.map((p, i) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      model_number: p.model_number,
      price: p.variants[0]?.price ?? 0,
      variants: [
        {
          variant_code: p.variants[0]?.variant_code ?? null,
        },
      ],
      image_url: relatedImages[i][0] ?? "/placeholder.svg",
    }))

    // ✅ Trả về kết quả đã được chuẩn hóa
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
        tags: product.products_tags.map((pt) => pt.tags.name),
        variant_code: variant.variant_code,
        title: product.name,
        slug: product.slug,
        currencyId: "USD",
        currencyFormat: "$",
        isFreeShipping: true,
        main_image_url: mainImage,
        hover_image_url: hoverImage,
        variants: enrichedVariants,
        related_products: relatedData,
        breadcrumb: [], // TODO: generate breadcrumb from slug or categories
      })
    )
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
