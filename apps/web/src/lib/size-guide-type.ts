export type SizeGuideType = "shoes" | "tops";

export function resolveSizeGuideType(product?: {
  category?: string | null;
  product_type?: string | null;
  name?: string | null;
}): SizeGuideType {
  const cat = (product?.category ?? "").toLowerCase();
  const type = (product?.product_type ?? "").toLowerCase();
  const name = (product?.name ?? "").toLowerCase();

  const topsHints = [
    "cloth",
    "apparel",
    "top",
    "jacket",
    "hoodie",
    "shirt",
    "tee",
    "short",
    "pant",
    "track",
    "unitefit",
  ];
  const shoeHints = ["shoe", "footwear", "cleat", "boot", "sneaker", "slide", "sandal"];

  if (topsHints.some((h) => cat.includes(h) || type.includes(h) || name.includes(h))) {
    return "tops";
  }
  if (shoeHints.some((h) => cat.includes(h) || type.includes(h) || name.includes(h))) {
    return "shoes";
  }

  return "shoes";
}
