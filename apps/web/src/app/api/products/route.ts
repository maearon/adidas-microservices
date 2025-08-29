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

    // const limitParam = searchParams.get("limit");
    // const pageSize = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 10; 
    // giới hạn max = 50 để tránh query quá nặng
    const pageSize = 12

    // ===== Lấy tất cả filters từ schema =====
    // Handle both array format (gender[]=men) and single format (gender=men)
    const getArrayParam = (paramName: string) => {
      // Lấy cả dạng "gender" và "gender[]"
      const values = [
        ...searchParams.getAll(paramName),
        ...searchParams.getAll(`${paramName}[]`),
      ];
      if (values.length > 0) return values.filter(Boolean);

      const singleValue = searchParams.get(paramName);
      return singleValue ? [singleValue] : [];
    };

    const genders = getArrayParam("gender");
    const categories = getArrayParam("category");
    const sports = getArrayParam("sport");
    const productTypes = getArrayParam("product_type");
    const brands = getArrayParam("brand");
    const materials = getArrayParam("material");
    const collections = getArrayParam("collection");
    const activities = getArrayParam("activity");
    const franchises = getArrayParam("franchise");
    
    // Price filters
    const priceMin = searchParams.get("min_price")
      ? parseFloat(searchParams.get("min_price")!)
      : undefined;
    const priceMax = searchParams.get("max_price")
      ? parseFloat(searchParams.get("max_price")!)
      : undefined;
    
    // Size and color filters
    const sizes = getArrayParam("size");
    const colors = getArrayParam("color");

    console.log("Filters applied:", {
      genders,
      categories,
      sports,
      productTypes,
      brands,
      materials,
      collections,
      activities,
      franchises,
      priceMin,
      priceMax,
      sizes,
      colors
    });

    // ===== Build where clause =====
    const where: Prisma.productsWhereInput = {};
    
    // Basic filters
    if (genders.length) where.gender = { in: genders, mode: "insensitive", };
    if (categories.length) where.category = { in: categories, mode: "insensitive", };
    if (sports.length) where.sport = { in: sports, mode: "insensitive", };
    if (productTypes.length) where.product_type = { in: productTypes };
    if (brands.length) where.brand = { in: brands };
    if (materials.length) where.material = { in: materials };
    if (collections.length) where.collection = { in: collections };
    if (activities.length) where.activity = { in: activities };
    if (franchises.length) where.franchise = { in: franchises };
    
    // Price filter through variants
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
    
    // Size filter through variants
    if (sizes.length) {
      where.variants = {
        ...where.variants,
        some: {
          ...where.variants?.some,
          variant_sizes: {
            some: {
              sizes: {
                label: { in: sizes }
              }
            }
          }
        }
      };
    }
    
    // Color filter through variants
    if (colors.length) {
      where.variants = {
        ...where.variants,
        some: {
          ...where.variants?.some,
          color: { in: colors }
        }
      };
    }

    console.log("Where clause:", JSON.stringify(where, null, 2));

    // ===== Count =====
    const totalCount = await prisma.products.count({ where });
    console.log("Total count:", totalCount);

    // ===== Query products =====
    const products = await prisma.products.findMany({
      where,
      include: {
        categories: { select: { name: true } },
        products_tags: {
          include: { tags: { select: { name: true } } },
        },
        variants: {
          include: { 
            variant_sizes: { 
              include: { sizes: true } 
            } 
          }
        }
      },
      orderBy: { created_at: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    console.log("Products found:", products.length);

    // ===== Enrich products with basic data (without images for now) =====
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
            compare_at_price: v?.compare_at_price,
            stock: v.stock,
            product_id: v.product_id,
            created_at: v.created_at,
            updated_at: v.updated_at,
            sizes: v.variant_sizes.map((vs) => vs.sizes.label),
            avatar_url: avatar[0],
            hover_url: hover[0],
            image_urls: images,
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
            mainImage[0],
          hover_image_url:
            hoverImage[0],
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

    console.log("API response successful, returning products:", enrichedProducts.length);

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
