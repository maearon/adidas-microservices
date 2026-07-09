export type SizeGuideType = "shoes" | "tops" | "mensTops";

export function resolveSizeGuideType(product?: {
  category?: string | null;
  product_type?: string | null;
  name?: string | null;
  gender?: string | null;
}): SizeGuideType {
  const cat = (product?.category ?? "").toLowerCase();
  const type = (product?.product_type ?? "").toLowerCase();
  const name = (product?.name ?? "").toLowerCase();
  const gender = (product?.gender ?? "").toLowerCase();

  const shoeHints = ["shoe", "footwear", "cleat", "boot", "sneaker", "slide", "sandal"];
  if (shoeHints.some((h) => cat.includes(h) || type.includes(h) || name.includes(h))) {
    return "shoes";
  }

  if (
    (name.includes("jersey") || type.includes("jersey")) &&
    !gender.includes("women") &&
    !gender.includes("kid") &&
    !gender.includes("girl")
  ) {
    return "mensTops";
  }

  if (name.includes("unitefit") || cat.includes("unitefit") || type.includes("unitefit")) {
    return "tops";
  }

  const mensApparelHints = [
    "jersey",
    "shirt",
    "polo",
    "tee",
    "top",
    "jacket",
    "hoodie",
    "cloth",
    "apparel",
  ];
  const isMens =
    gender.includes("men") ||
    gender.includes("male") ||
    cat.includes("men") ||
    name.includes("men's") ||
    name.includes("mens ");

  if (
    isMens &&
    mensApparelHints.some((h) => cat.includes(h) || type.includes(h) || name.includes(h))
  ) {
    return "mensTops";
  }

  if (mensApparelHints.some((h) => cat.includes(h) || type.includes(h) || name.includes(h))) {
    return "tops";
  }

  return "shoes";
}
