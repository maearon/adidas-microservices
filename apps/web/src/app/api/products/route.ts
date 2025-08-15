// /app/api/products/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getProductSearchSelect } from "@/lib/types";
import { serializeBigInt } from "@/lib/bigint";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const cursorParam = searchParams.get("cursor");
    const cursor = cursorParam && !isNaN(Number(cursorParam)) 
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

    // ===== Build điều kiện where =====
    const where: Prisma.productsWhereInput = {};

    if (genders.length) {
      where.gender = { in: genders };
    }
    if (categories.length) {
      where.category = { in: categories };
    }
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

    // ===== Đếm tổng sản phẩm =====
    const totalCount = await prisma.products.count({ where });

    // ===== Query sản phẩm =====
    const products = await prisma.products.findMany({
      where,
      select: getProductSearchSelect(),
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    // ===== Enrich ảnh & variants =====
    const productsWithImages = await Promise.all(
      products.slice(0, pageSize).map(async (product) => {
        // Ảnh chính
        const productAttachments =
          await prisma.active_storage_attachments.findMany({
            where: { record_type: "Product", record_id: product.id },
            orderBy: { id: "asc" },
            select: { active_storage_blobs: { select: { key: true } } },
          });

        const productImages = productAttachments
          .map((att) =>
            att.active_storage_blobs?.key
              ? `https://res.cloudinary.com/dq7vadalc/image/upload/${att.active_storage_blobs.key}`
              : null
          )
          .filter(Boolean) as string[];

        // Variants
        const variants = await prisma.variants.findMany({
          where: { product_id: product.id },
        });

        const enrichedVariants = await Promise.all(
          variants.map(async (variant) => {
            const variantAttachments =
              await prisma.active_storage_attachments.findMany({
                where: { record_type: "Variant", record_id: variant.id },
                orderBy: { id: "asc" },
                select: { active_storage_blobs: { select: { key: true } } },
              });

            const imageUrls = variantAttachments
              .map((att) =>
                att.active_storage_blobs?.key
                  ? `https://res.cloudinary.com/dq7vadalc/image/upload/${att.active_storage_blobs.key}`
                  : null
              )
              .filter(Boolean) as string[];

            return {
              ...variant,
              avatar_url:
                imageUrls[0] || "/placeholder.svg?height=300&width=250",
              images: imageUrls,
            };
          })
        );

        const firstVariant = enrichedVariants[0];

        return {
          ...product,
          price: firstVariant?.price ?? null,
          compare_at_price: firstVariant?.compare_at_price ?? null,
          image_url:
            productImages[0] || "/placeholder.svg?height=300&width=250",
          hover_image_url:
            productImages[1] || "/placeholder.svg?height=300&width=250",
          variants: enrichedVariants,
        };
      })
    );

    // ===== Cursor cho trang tiếp =====
    const nextCursor =
      products.length > pageSize ? products[pageSize].id.toString() : null;

    return Response.json(
      serializeBigInt({
        products: productsWithImages,
        nextCursor,
        totalCount,
      })
    );
  } catch (error) {
    console.error("Products route error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
