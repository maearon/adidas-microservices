import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { serializeBigInt } from "@/lib/bigint";
import { Prisma } from "@prisma/client";
import { getImageUrlsByRecord } from "@/lib/attachments";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    console.log("Products route called", req);
    const searchParams = req.nextUrl.searchParams;
    const cursorParam = searchParams.get("cursor");
    const cursor =
      cursorParam && !isNaN(Number(cursorParam))
        ? BigInt(cursorParam)
        : undefined;

    const pageSize = 10;

    // ===== Lấy filters =====
    const genders = searchParams.getAll("gender").filter(Boolean);
    const categories = searchParams.getAll("category").filter(Boolean);
    const priceMin = searchParams.get("price_min")
      ? parseFloat(searchParams.get("price_min")!)
      : undefined;
    const priceMax = searchParams.get("price_max")
      ? parseFloat(searchParams.get("price_max")!)
      : undefined;

    // ===== Build where =====
    const where: Prisma.productsWhereInput = {};
    if (genders.length) where.gender = { in: genders };
    if (categories.length) where.category = { in: categories };
    if (priceMin !== undefined || priceMax !== undefined) {
      where.variants = {
        some: {
          price: {
            ...(priceMin !== undefined ? { gte: priceMin } : {}),
            ...(priceMax !== undefined ? { lte: priceMax } : {}),
          },
        },
      };
    }

    // ===== Count =====
    const totalCount = await prisma.products.count({ where });

    // ===== Query products =====
    const products = await prisma.products.findMany({
      where,
      include: {
        categories: { select: { name: true } },
        products_tags: {
          include: { tags: { select: { name: true } } },
        },
      },
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // ===== Enrich ảnh + variants =====
    const enrichedProducts = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        // Ảnh chính
        const [mainImage, hoverImage] = await Promise.all([
          getImageUrlsByRecord("Product", product.id, "image"),
          getImageUrlsByRecord("Product", product.id, "hover_image"),
        ]);

        // Variants
        const variants = await prisma.variants.findMany({
          where: { product_id: product.id },
          include: { variant_sizes: { include: { sizes: true } } },
        });

        const variantImageResults = await Promise.all(
          variants.map(async (v) => {
            const [images, avatar, hover] = await Promise.all([
              getImageUrlsByRecord("Variant", v.id, "images"),
              getImageUrlsByRecord("Variant", v.id, "avatar"),
              getImageUrlsByRecord("Variant", v.id, "hover"),
            ]);
            return { v, images, avatar, hover };
          })
        );

        const enrichedVariants = variantImageResults.map(
          ({ v, images, avatar, hover }) => ({
            id: v.id,
            variant_code: v.variant_code,
            color: v.color,
            price: v.price,
            compare_at_price: v.compare_at_price,
            stock: v.stock,
            product_id: v.product_id,
            created_at: v.created_at,
            updated_at: v.updated_at,
            sizes: v.variant_sizes.map((vs) => vs.sizes.label),
            avatar_url: avatar?.[0] ?? undefined,
            hover_url: hover?.[0] ?? undefined,
            image_urls: images ?? [],
          })
        );

        const firstVariant = enrichedVariants[0];

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
          main_image_url:
            mainImage?.[0] ?? undefined,
          hover_image_url:
            hoverImage?.[0] ?? undefined,
          variants: enrichedVariants,
          currencyId: "USD",
          currencyFormat: "$",
          isFreeShipping: true,
        };
      })
    );

    // ===== Cursor =====
    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null;

    return Response.json(
      serializeBigInt({
        products: enrichedProducts,
        nextCursor,
        totalCount,
      })
    );
  } catch (error) {
    console.error("Products route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
