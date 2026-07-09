export type SizeGuideType = "shoes" | "tops" | "mensTops";

/** Khớp với seed: database/shared/prisma/seed.ts */
export const SEED_PRODUCT_TYPES = [
  "Sneakers",
  "Cleats",
  "Sandals",
  "Hoodie",
  "Pants",
  "Shorts",
  "Jacket",
  "Jersey",
  "TShirt",
  "TankTop",
  "Dress",
  "Leggings",
  "Tracksuit",
  "Bra",
  "Coat",
] as const;

export type SeedProductType = (typeof SEED_PRODUCT_TYPES)[number];

/** product_type → size guide (category Shoes luôn là giày) */
const SHOE_TYPES = new Set<SeedProductType>(["Sneakers", "Cleats", "Sandals"]);

const MENS_TOPS_TYPES = new Set<SeedProductType>([
  "Jersey",
  "TShirt",
  "TankTop",
  "Hoodie",
  "Jacket",
  "Coat",
  "Tracksuit",
]);

/** UNITEFIT / apparel chung (chưa có bảng quần riêng) */
const UNITEFIT_APPAREL_TYPES = new Set<SeedProductType>([
  "Dress",
  "Bra",
  "Pants",
  "Shorts",
  "Leggings",
]);

function normalizeProductTypeKey(value?: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSeedType(value: string | undefined, set: Set<SeedProductType>): boolean {
  if (!value) return false;
  const key = normalizeProductTypeKey(value);
  return [...set].some((t) => normalizeProductTypeKey(t) === key);
}

function isMensGender(gender: string): boolean {
  return (
    gender.includes("men") ||
    gender.includes("male") ||
    gender === "m"
  );
}

function isWomensOrKidsGender(gender: string): boolean {
  return (
    gender.includes("women") ||
    gender.includes("woman") ||
    gender.includes("kid") ||
    gender.includes("girl") ||
    gender.includes("boy") ||
    gender === "w"
  );
}

export function resolveSizeGuideType(product?: {
  category?: string | null;
  product_type?: string | null;
  name?: string | null;
  gender?: string | null;
}): SizeGuideType {
  const productType = product?.product_type ?? "";
  const category = (product?.category ?? "").trim().toLowerCase();
  const gender = (product?.gender ?? "").trim().toLowerCase();

  if (category === "shoes" || isSeedType(productType, SHOE_TYPES)) {
    return "shoes";
  }

  if (isSeedType(productType, MENS_TOPS_TYPES)) {
    if (isWomensOrKidsGender(gender)) return "tops";
    return "mensTops";
  }

  if (isSeedType(productType, UNITEFIT_APPAREL_TYPES)) {
    return "tops";
  }

  if (category === "apparel") {
    if (isMensGender(gender) && !isWomensOrKidsGender(gender)) return "mensTops";
    return "tops";
  }

  return "shoes";
}
