import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getImageUrlsByRecord } from "@/lib/attachments";
import { serializeBigInt } from "@/lib/bigint";

// 🔤 Bỏ dấu tiếng Việt để tìm kiếm tự nhiên hơn
function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const qRaw = req.nextUrl.searchParams.get("q")?.trim() || "";
  if (!qRaw) return Response.json({ suggestions: [], products: [] });

  // 🧠 Chuẩn hóa từ khóa
  const q = removeVietnameseTones(qRaw.toLowerCase());

  try {
    // =====================================================
    // 1️⃣ GỢI Ý THEO TÊN SẢN PHẨM (ưu tiên)
    // =====================================================
    const nameMatches = await prisma.products.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        gender: true,
        category: true,
        slug: true,
      },
      take: 5,
    });

    // Tạo suggestions từ tên sản phẩm khớp
    const nameSuggestions = nameMatches.map((p) => ({
      term: p.name,
      count: 1,
    }));

    // =====================================================
    // 2️⃣ GỢI Ý THEO CATEGORY / GENDER / TYPE
    // =====================================================
    const categorySuggestionsRaw = await prisma.products.groupBy({
      by: ["category"],
      _count: { category: true },
      where: {
        category: { not: null },
        name: { contains: q, mode: "insensitive" },
      },
      orderBy: { _count: { category: "desc" } },
      take: 5,
    });

    const genderSuggestionsRaw = await prisma.products.groupBy({
      by: ["gender"],
      _count: { gender: true },
      where: {
        gender: { not: null },
        name: { contains: q, mode: "insensitive" },
      },
      orderBy: { _count: { gender: "desc" } },
      take: 5,
    });

    const categorySuggestions = categorySuggestionsRaw.map((item) => ({
      term: item.category,
      count: item._count.category,
    }));

    const genderSuggestions = genderSuggestionsRaw.map((item) => ({
      term: item.gender,
      count: item._count.gender,
    }));

    // =====================================================
    // 3️⃣ GỘP GỢI Ý (ưu tiên tên lên đầu)
    // =====================================================
    const mergedSuggestions = [
      ...nameSuggestions,
      ...categorySuggestions,
      ...genderSuggestions,
    ]
      // loại bỏ null / trùng lặp term
      .filter((s) => s.term && s.term.trim() !== "")
      .reduce((acc, curr) => {
        if (!acc.some((s) => s?.term?.toLowerCase() === curr?.term?.toLowerCase())) {
          acc.push(curr);
        }
        return acc;
      }, [] as { term: string | null; count: number }[])
      .slice(0, 10);

    // =====================================================
    // 4️⃣ LẤY TOP 4 SẢN PHẨM KHỚP TÊN
    // =====================================================
    const matchedProducts = await prisma.products.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      include: {
        categories: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
      take: 4,
    });

    // =====================================================
    // 5️⃣ BỔ SUNG ẢNH & GIÁ
    // =====================================================
    const enrichedProducts = await Promise.all(
      matchedProducts.map(async (p) => {
        const [mainImage] = await getImageUrlsByRecord("Product", p.id, "image");

        const variant = await prisma.variants.findFirst({
          where: { product_id: p.id },
          orderBy: { price: "asc" },
        });

        const categoryName =
          Array.isArray(p.categories) && p.categories.length > 0
            ? p.categories[0].name
            : p.category ?? "";

        return {
          id: p.id,
          name: p.name,
          category: categoryName,
          gender: p.gender,
          price: variant?.price ?? null,
          variant_code: variant?.variant_code ?? null,
          image: mainImage ?? "/placeholder.svg?height=90&width=90",
        };
      })
    );

    // =====================================================
    // ✅ TRẢ KẾT QUẢ
    // =====================================================
    return Response.json(
      serializeBigInt({
        suggestions: mergedSuggestions,
        products: enrichedProducts,
      })
    );
  } catch (error) {
    console.error("Search suggestion error:", error);
    return Response.json(
      { error: "Internal Server Error", details: String(error) },
      { status: 500 }
    );
  }
}
