import prisma from "@/lib/prisma"
import { getImageUrlsByRecord } from "@/lib/attachments"
import type { Product } from "@/types/product"

async function mapProductsToCarousel(products: Awaited<ReturnType<typeof fetchProducts>>) {
  const [mainImages, hoverImages, variantImages] = await Promise.all([
    Promise.all(products.map((p) => getImageUrlsByRecord("Product", p.id, "image"))),
    Promise.all(products.map((p) => getImageUrlsByRecord("Product", p.id, "hover_image"))),
    Promise.all(
      products.map(async (p) => {
        const variant = p.variants[0]
        if (!variant) return { avatar: [] as string[], hover: [] as string[] }
        const [avatar, hover] = await Promise.all([
          getImageUrlsByRecord("Variant", variant.id, "avatar"),
          getImageUrlsByRecord("Variant", variant.id, "hover"),
        ])
        return { avatar, hover }
      }),
    ),
  ])

  return products.map((product, index) => {
    const variant = product.variants[0]
    const { avatar, hover } = variantImages[index]

    return {
      id: String(product.id),
      name: product.name,
      title: product.name,
      description: "",
      description_h5: "",
      specifications: "",
      care: "",
      tags: [],
      sport: product.sport ?? "",
      model_number: product.model_number ?? "",
      price: variant?.price ?? 0,
      compare_at_price: variant?.compare_at_price ?? 0,
      category: product.categories?.name ?? "",
      main_image_url:
        avatar[0] || mainImages[index][0] || hover[0] || hoverImages[index][0] || "/placeholder.png",
      image_url:
        avatar[0] || mainImages[index][0] || hover[0] || hoverImages[index][0] || "/placeholder.png",
      image: avatar[0] || mainImages[index][0] || "/placeholder.png",
      hover_image_url: hover[0] || hoverImages[index][0] || mainImages[index][0] || "/placeholder.png",
      variants: variant
        ? [
            {
              id: String(variant.id),
              variant_code: variant.variant_code ?? "",
              avatar_url: avatar[0] || mainImages[index][0] || "/placeholder.png",
              hover_url: hover[0] || hoverImages[index][0] || "/placeholder.png",
              price: variant.price,
              compare_at_price: variant.compare_at_price ?? 0,
              color: variant.color ?? "",
              sizes: [],
            },
          ]
        : [],
    } as Product
  })
}

async function fetchProducts(where: Record<string, unknown>, take: number) {
  return prisma.products.findMany({
    where,
    take,
    orderBy: { updated_at: "desc" },
    include: {
      variants: { take: 1, orderBy: { id: "asc" } },
      categories: { select: { name: true } },
    },
  })
}

export async function getRelatedProducts(params: {
  productId?: bigint | null
  limit?: number
  strategy?: "related" | "complete-look" | "also-like" | "top-picks"
  category?: string | null
  gender?: string | null
  sport?: string | null
  excludeVariantIds?: bigint[]
}) {
  const limit = params.limit ?? 12
  const excludeIds = params.excludeVariantIds ?? []

  let products = params.productId
    ? await fetchProducts(
        {
          id: { not: params.productId },
          gender: params.gender ?? undefined,
          category: params.category ?? undefined,
          sport: params.sport ?? undefined,
        },
        limit,
      )
    : []

  if (products.length < limit) {
    const fallback = await fetchProducts(
      {
        id: params.productId ? { not: params.productId } : undefined,
        category: params.category ?? undefined,
      },
      limit - products.length,
    )
    products = [...products, ...fallback]
  }

  if (params.strategy === "complete-look" && products.length > 1) {
    products = [...products].sort((a, b) => Number(a.id - b.id))
  }

  if (params.strategy === "also-like" && products.length > 1) {
    products = [...products].sort((a, b) => Number(b.id - a.id))
  }

  const mapped = await mapProductsToCarousel(products)
  if (!excludeIds.length) return mapped.slice(0, limit)

  return mapped
    .filter((product) => !excludeIds.includes(BigInt(product.variants?.[0]?.id ?? 0)))
    .slice(0, limit)
}

export async function getTopPickProducts(params?: {
  category?: string | null
  limit?: number
}) {
  return getRelatedProducts({
    category: params?.category,
    limit: params?.limit ?? 12,
    strategy: "top-picks",
  })
}
