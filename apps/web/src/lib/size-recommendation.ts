export type HeightUnit = "inch" | "cm";
export type WeightUnit = "lb" | "kg";
export type ShoppingPreference = "unisex" | "mens" | "womens";

export interface SizeProfileInput {
  heightUnit: HeightUnit;
  heightCm: string;
  heightFt: string;
  heightIn: string;
  weightUnit: WeightUnit;
  weight: string;
  age: string;
  preference: ShoppingPreference;
}

export function heightToCm(profile: SizeProfileInput): number | null {
  if (profile.heightUnit === "cm") {
    const v = Number(profile.heightCm);
    return Number.isFinite(v) && v > 0 ? v : null;
  }
  const ft = Number(profile.heightFt);
  const inch = Number(profile.heightIn);
  if (!Number.isFinite(ft) || !Number.isFinite(inch) || ft < 0 || inch < 0) return null;
  return ft * 30.48 + inch * 2.54;
}

export function weightToKg(profile: SizeProfileInput): number | null {
  const v = Number(profile.weight);
  if (!Number.isFinite(v) || v <= 0) return null;
  return profile.weightUnit === "kg" ? v : v * 0.453592;
}

export function recommendTopSize(profile: SizeProfileInput): string {
  const heightCm = heightToCm(profile);
  const weightKg = weightToKg(profile);
  if (!heightCm || !weightKg) return "M";

  let size = "M";
  if (heightCm < 158) size = "XS";
  else if (heightCm < 168) size = "S";
  else if (heightCm < 178) size = "M";
  else if (heightCm < 188) size = "L";
  else size = "XL";

  if (weightKg > 85 && size === "S") size = "M";
  if (weightKg > 95 && size === "M") size = "L";
  if (weightKg > 105 && size === "L") size = "XL";
  if (weightKg < 55 && size === "M") size = "S";
  if (weightKg < 48 && size === "S") size = "XS";

  if (profile.preference === "womens") {
    const order = ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL"];
    const idx = order.indexOf(size);
    if (idx > 0) size = order[idx - 1];
  }

  return size;
}
