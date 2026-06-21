import prisma from "@/lib/prisma"
import { getImageUrlsByRecord } from "@/lib/attachments"
import { buildProductDetailUrl } from "@/lib/commerce/product-url"
import type { CartApiItem, WishApiItem } from "@/lib/commerce/types"

async function getVariantImageUrls(variantId: bigint, productId: bigint) {
  const [avatar, productImage, hover] = await Promise.all([
    getImageUrlsByRecord("Variant", variantId, "avatar"),
    getImageUrlsByRecord("Product", productId, "image"),
    getImageUrlsByRecord("Variant", variantId, "hover"),
  ])

  return {
    image: avatar[0] || productImage[0] || hover[0] || "/placeholder.png",
    hover: hover[0] || productImage[0] || "/placeholder.png",
  }
}

export async function enrichCartLine(
  variantId: bigint,
  quantity: number,
  size?: string | null,
): Promise<CartApiItem | null> {
  const variant = await prisma.variants.findUnique({
    where: { id: variantId },
    include: {
      products: { include: { categories: { select: { name: true } } } },
    },
  })

  if (!variant?.products) return null

  const { image } = await getVariantImageUrls(variant.id, variant.product_id)

  return {
    id: Number(variant.id),
    productId: String(variant.product_id),
    variantId: String(variant.id),
    name: variant.products.name,
    price: variant.price,
    compareAtPrice: variant.compare_at_price ?? null,
    image,
    color: variant.color ?? "",
    size: size ?? "",
    quantity,
    category: variant.products.categories?.name ?? "",
    sport: variant.products.sport ?? "",
    url: buildProductDetailUrl({
      slug: variant.products.slug,
      name: variant.products.name,
      variantCode: variant.variant_code,
    }),
    variantCode: variant.variant_code ?? undefined,
    slug: variant.products.slug,
  }
}

export async function enrichWishLine(variantId: bigint): Promise<WishApiItem | null> {
  const variant = await prisma.variants.findUnique({
    where: { id: variantId },
    include: {
      products: { include: { categories: { select: { name: true } } } },
    },
  })

  if (!variant?.products) return null

  const { image } = await getVariantImageUrls(variant.id, variant.product_id)

  return {
    id: Number(variant.id),
    productId: String(variant.product_id),
    variantId: String(variant.id),
    name: variant.products.name,
    price: String(variant.price),
    image,
    color: variant.color ?? "",
    category: variant.products.categories?.name ?? "",
    sport: variant.products.sport ?? "",
    url: buildProductDetailUrl({
      slug: variant.products.slug,
      name: variant.products.name,
      variantCode: variant.variant_code,
    }),
    variantCode: variant.variant_code ?? undefined,
    slug: variant.products.slug,
  }
}

export async function enrichCartLines(
  lines: Array<{ variantId: bigint; quantity: number; size?: string | null }>,
) {
  const items = await Promise.all(
    lines.map((line) => enrichCartLine(line.variantId, line.quantity, line.size)),
  )
  return items.filter((item): item is CartApiItem => item !== null)
}

export async function enrichWishLines(lines: Array<{ variantId: bigint }>) {
  const items = await Promise.all(lines.map((line) => enrichWishLine(line.variantId)))
  return items.filter((item): item is WishApiItem => item !== null)
}
