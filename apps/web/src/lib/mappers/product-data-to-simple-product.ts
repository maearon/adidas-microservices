import { Product } from "@/types/product";
import { formatPrice } from "../utils";

export function mapProductDataToSimpleProduct(productData: any): Product {
  // ✅ Bảo vệ khi variants không tồn tại hoặc không phải array
  const variants = Array.isArray(productData?.variants) ? productData.variants : [];
  const firstVariant = variants[0];

  return {
    id: String(productData?.id || ""),
    name: productData?.name || "",
    sport: productData?.sport || "",
    model_number: productData?.model_number || "",

    // ✅ Ưu tiên lấy từ variant đầu tiên, fallback sang product
    price:
      Number(formatPrice(firstVariant?.price).replace("$", "")) ||
      Number(formatPrice(productData?.price).replace("$", "")) ||
      0,

    compare_at_price:
      Number(formatPrice(firstVariant?.compare_at_price).replace("$", "")) ||
      Number(formatPrice(productData?.compare_at_price).replace("$", "")) ||
      0,

    // ✅ Map tất cả variants (nếu có)
    variants: variants.map((v: any) => ({
      variant_code: v?.variant_code || "JX5311",
      avatar_url:
        v?.avatar_url ||
        v?.image_urls?.[0] ||
        productData?.main_image_url ||
        "/placeholder.png",
    })),

    // ✅ Ảnh chính lấy từ variant đầu tiên hoặc product
    main_image_url:
      firstVariant?.avatar_url ||
      firstVariant?.image_urls?.[0] ||
      productData?.main_image_url ||
      "/placeholder.png",
  };
}
