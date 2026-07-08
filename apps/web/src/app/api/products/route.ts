import { NextRequest } from "next/server"
import prisma from "@/lib/prisma"
import { serializeBigInt } from "@/lib/bigint"
import { Prisma } from "@prisma/client"
import { getImageUrlsByRecord } from "@/lib/attachments"

export const dynamic = "force-dynamic"

const COLOR_HEX: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  grey: "#808080",
  gray: "#808080",
  blue: "#2563eb",
  red: "#dc2626",
  green: "#16a34a",
  beige: "#d2b48c",
  yellow: "#eab308",
  brown: "#92400e",
  silver: "#c0c0c0",
  purple: "#7c3aed",
  orange: "#ea580c",
  pink: "#ec4899",
  turquoise: "#14b8a6",
}

function getArrayParam(searchParams: URLSearchParams, paramName: string): string[] {
  const values = [
    ...searchParams.getAll(paramName),
    ...searchParams.getAll(`${paramName}[]`),
  ]
  if (values.length > 0) {
    return values
      .flatMap((v) => v.split(","))
      .map((v) => v.trim())
      .filter(Boolean)
  }
  const single = searchParams.get(paramName)
  return single
    ? single
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : []
}

function buildWhere(searchParams: URLSearchParams): Prisma.productsWhereInput {
  const genders = getArrayParam(searchParams, "gender")
  const categories = getArrayParam(searchParams, "category")
  const sports = getArrayParam(searchParams, "sport")
  const productTypes = getArrayParam(searchParams, "product_type")
  const brands = getArrayParam(searchParams, "brand")
  const materials = getArrayParam(searchParams, "material")
  const collections = getArrayParam(searchParams, "collection")
  const activities = getArrayParam(searchParams, "activity")
  const franchises = getArrayParam(searchParams, "franchise")
  const sizes = getArrayParam(searchParams, "size")
  const colors = getArrayParam(searchParams, "color")
  const shipping = getArrayParam(searchParams, "shipping")

  const priceMin = searchParams.get("min_price")
    ? parseFloat(searchParams.get("min_price")!)
    : undefined
  const priceMax = searchParams.get("max_price")
    ? parseFloat(searchParams.get("max_price")!)
    : undefined

  const where: Prisma.productsWhereInput = {
    status: "active",
  }

  if (genders.length) where.gender = { in: genders, mode: "insensitive" }
  if (categories.length) where.category = { in: categories, mode: "insensitive" }
  if (sports.length) where.sport = { in: sports, mode: "insensitive" }
  if (productTypes.length) where.product_type = { in: productTypes, mode: "insensitive" }
  if (brands.length) where.brand = { in: brands, mode: "insensitive" }
  if (materials.length) where.material = { in: materials, mode: "insensitive" }
  if (collections.length) where.collection = { in: collections, mode: "insensitive" }
  if (activities.length) where.activity = { in: activities, mode: "insensitive" }
  if (franchises.length) where.franchise = { in: franchises, mode: "insensitive" }

  const variantSome: Prisma.variantsWhereInput = {}

  if (priceMin !== undefined || priceMax !== undefined) {
    variantSome.price = {
      ...(priceMin !== undefined ? { gte: priceMin } : {}),
      ...(priceMax !== undefined ? { lte: priceMax } : {}),
    }
  }

  if (sizes.length) {
    variantSome.variant_sizes = {
      some: { sizes: { label: { in: sizes, mode: "insensitive" } } },
    }
  }

  if (colors.length) {
    variantSome.color = { in: colors, mode: "insensitive" }
  }

  if (Object.keys(variantSome).length > 0) {
    where.variants = { some: variantSome }
  }

  if (shipping.some((s) => s.toLowerCase().includes("prime"))) {
    where.products_tags = {
      some: {
        tags: {
          OR: [
            { slug: { equals: "prime_delivery", mode: "insensitive" } },
            { slug: { equals: "prime", mode: "insensitive" } },
            { name: { equals: "prime_delivery", mode: "insensitive" } },
            { name: { equals: "prime", mode: "insensitive" } },
          ],
        },
      },
    }
  }

  // best_for / surface / width: accepted but ignored until schema exists
  return where
}

function resolveSort(sortParam: string | null): Prisma.productsOrderByWithRelationInput | Prisma.productsOrderByWithRelationInput[] {
  const key = (sortParam || "newest").toLowerCase().replace(/[_\s()]+/g, "-")
  switch (key) {
    case "price-low-high":
    case "price-low---high":
      // Prisma can't order by nested min easily without raw; fallback created_at then FE can refine
      return { created_at: "desc" }
    case "price-high-low":
    case "price-high---low":
      return { created_at: "desc" }
    case "top-sellers":
      return { is_featured: "desc" }
    case "newest":
    default:
      return { created_at: "desc" }
  }
}

async function computeFacets(baseWhere: Prisma.productsWhereInput) {
  const products = await prisma.products.findMany({
    where: baseWhere,
    select: {
      id: true,
      gender: true,
      category: true,
      sport: true,
      activity: true,
      collection: true,
      material: true,
      brand: true,
      variants: {
        select: {
          color: true,
          price: true,
          variant_sizes: { select: { sizes: { select: { label: true } } } },
        },
      },
      products_tags: { select: { tags: { select: { slug: true, name: true } } } },
    },
  })

  const countMap = (values: (string | null | undefined)[]) => {
    const map = new Map<string, number>()
    for (const raw of values) {
      if (!raw) continue
      const key = raw.trim()
      if (!key) continue
      map.set(key, (map.get(key) || 0) + 1)
    }
    return Array.from(map.entries())
      .map(([value, count]) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }

  const gender = countMap(products.map((p) => p.gender))
  const category = countMap(products.map((p) => p.category))
  const sport = countMap(products.map((p) => p.sport))
  const activity = countMap(products.map((p) => p.activity))
  const collection = countMap(products.map((p) => p.collection))
  const material = countMap(products.map((p) => p.material))
  const brand = countMap(products.map((p) => p.brand))

  const colorValues: string[] = []
  const sizeValues: string[] = []
  const prices: number[] = []
  let primeCount = 0

  for (const p of products) {
    const hasPrime = p.products_tags.some((pt) => {
      const slug = (pt.tags.slug || "").toLowerCase()
      const name = (pt.tags.name || "").toLowerCase()
      return slug === "prime_delivery" || slug === "prime" || name === "prime_delivery" || name === "prime"
    })
    if (hasPrime) primeCount += 1

    for (const v of p.variants) {
      if (v.color) colorValues.push(v.color)
      if (typeof v.price === "number") prices.push(v.price)
      for (const vs of v.variant_sizes) {
        if (vs.sizes?.label) sizeValues.push(vs.sizes.label)
      }
    }
  }

  // Color: count unique products per color (approx via colorValues of variants — may overcount)
  const colorProductMap = new Map<string, Set<bigint>>()
  const sizeProductMap = new Map<string, Set<bigint>>()
  for (const p of products) {
    for (const v of p.variants) {
      if (v.color) {
        const c = v.color.trim()
        if (!colorProductMap.has(c)) colorProductMap.set(c, new Set())
        colorProductMap.get(c)!.add(p.id)
      }
      for (const vs of v.variant_sizes) {
        const label = vs.sizes?.label?.trim()
        if (!label) continue
        if (!sizeProductMap.has(label)) sizeProductMap.set(label, new Set())
        sizeProductMap.get(label)!.add(p.id)
      }
    }
  }

  const colors = Array.from(colorProductMap.entries())
    .map(([value, set]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count: set.size,
      hex: COLOR_HEX[value.toLowerCase()] || "#cccccc",
    }))
    .sort((a, b) => b.count - a.count)

  const sizes = Array.from(sizeProductMap.entries())
    .map(([value, set]) => ({ value, label: value, count: set.size }))
    .sort((a, b) => Number(a.value) - Number(b.value))

  return {
    gender,
    category,
    sport,
    activity,
    collection,
    material,
    brand,
    colors,
    sizes,
    shipping: [{ value: "prime", label: "PRIME", count: primeCount }],
    best_for: [] as { value: string; label: string; count: number }[],
    surface: [] as { value: string; label: string; count: number }[],
    width: [] as { value: string; label: string; count: number }[],
    price_range: {
      min: prices.length ? Math.floor(Math.min(...prices)) : 0,
      max: prices.length ? Math.ceil(Math.max(...prices)) : 500,
    },
    total_count: products.length,
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const cursorParam = searchParams.get("cursor")
    const cursor =
      cursorParam && !isNaN(Number(cursorParam)) ? BigInt(cursorParam) : undefined
    const pageSize = 12
    const sort = searchParams.get("sort")
    const includeFacets = searchParams.get("include_facets") !== "0"

    const where = buildWhere(searchParams)
    const totalCount = await prisma.products.count({ where })

    // Price sort via raw-ish approach: fetch then sort for small page, or use created_at
    const needsPriceSort =
      sort &&
      /price.*(low|high)|price.*(high|low)/i.test(sort.replace(/[_\s()-]+/g, " "))

    let products
    if (needsPriceSort) {
      const allMatching = await prisma.products.findMany({
        where,
        include: {
          categories: { select: { name: true } },
          products_tags: { include: { tags: { select: { name: true, slug: true } } } },
          variants: {
            include: { variant_sizes: { include: { sizes: true } } },
            orderBy: { price: "asc" },
          },
        },
      })

      const dir =
        /high.*low|high-low|high_low/i.test(sort || "") ? "desc" : "asc"

      allMatching.sort((a, b) => {
        const pa = a.variants[0]?.price ?? Number.POSITIVE_INFINITY
        const pb = b.variants[0]?.price ?? Number.POSITIVE_INFINITY
        return dir === "asc" ? pa - pb : pb - pa
      })

      const startIdx = cursor
        ? allMatching.findIndex((p) => p.id === cursor) + 1
        : 0
      products = allMatching.slice(startIdx, startIdx + pageSize + 1)
    } else {
      products = await prisma.products.findMany({
        where,
        include: {
          categories: { select: { name: true } },
          products_tags: { include: { tags: { select: { name: true, slug: true } } } },
          variants: {
            include: { variant_sizes: { include: { sizes: true } } },
            orderBy: { price: "asc" },
          },
        },
        orderBy: resolveSort(sort),
        take: pageSize + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      })
    }

    const enrichedProducts = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        const [mainImage, hoverImage] = await Promise.all([
          getImageUrlsByRecord("Product", product.id, "image"),
          getImageUrlsByRecord("Product", product.id, "hover_image"),
        ])

        const variantImageResults = await Promise.all(
          product.variants.map(async (v) => {
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
          avatar_url: avatar[0],
          hover_url: hover[0],
          image_urls: images,
        }))

        const firstVariant = enrichedVariants[0]
        const tags = product.products_tags.map((pt) => pt.tags.name || pt.tags.slug)

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
          collection: product.collection,
          activity: product.activity,
          material: product.material,
          description_h5: product.description_h5,
          description_p: product.description_p,
          specifications: product.specifications,
          care: product.care,
          created_at: product.created_at,
          updated_at: product.updated_at,
          category: product.category || product.categories?.name || "",
          tags,
          price: firstVariant?.price ?? null,
          compare_at_price: firstVariant?.compare_at_price ?? null,
          main_image_url: mainImage[0],
          hover_image_url: hoverImage[0],
          variants: enrichedVariants,
          currencyId: "USD",
          currencyFormat: "$",
          isFreeShipping: tags.some((t) =>
            ["prime", "prime_delivery"].includes((t || "").toLowerCase())
          ),
        }
      })
    )

    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null

    const facets = includeFacets ? await computeFacets(where) : null

    return Response.json(
      serializeBigInt({
        products: enrichedProducts,
        nextCursor,
        totalCount,
        facets,
      })
    )
  } catch (error) {
    console.error("Products route error:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
