import { slugify } from "@/utils/slugify"

type ProductUrlInput = {
  url?: string | null
  slug?: string | null
  name?: string | null
  variantCode?: string | null
}

export function buildProductDetailUrl(input: ProductUrlInput): string | undefined {
  const existing = input.url?.trim()
  if (existing && existing !== "#") {
    return existing.endsWith(".html") ? existing : `${existing}.html`
  }

  const variantCode = input.variantCode?.trim()
  if (!variantCode) return undefined

  const slug = (input.slug?.trim() || slugify(input.name ?? "")).replace(/^\/+|\/+$/g, "")
  if (!slug) return undefined

  return `/${slug}/${variantCode}.html`
}

export function resolveCommerceItemUrl(input: ProductUrlInput): string {
  return buildProductDetailUrl(input) ?? "#"
}
