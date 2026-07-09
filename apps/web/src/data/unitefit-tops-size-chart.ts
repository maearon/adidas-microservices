import type { SizeUnit } from "@/data/kids-shoes-size-chart";

export type ApparelMeasureRow = "chest" | "waist" | "hip";

export interface ApparelSizeColumn {
  label: string;
  chest: string;
  waist: string;
  hip: string;
}

export const unitefitTopsSizeChart: Record<SizeUnit, ApparelSizeColumn[]> = {
  inches: [
    { label: "34 (3XS)", chest: '28 3/4 - 30 3/4"', waist: '22 1/2 - 23 1/2"', hip: '32 - 33 1/2"' },
    { label: "38 (2XS)", chest: '30 3/4 - 32 1/4"', waist: '24 - 26 3/4"', hip: '33 3/4 - 35 3/4"' },
    { label: "42 (XS)", chest: '32 1/4 - 34 1/4"', waist: '26 3/4 - 28 3/4"', hip: '35 3/4 - 37 1/2"' },
    { label: "46 (S)", chest: '34 1/4 - 36 1/4"', waist: '28 3/4 - 30 3/4"', hip: '37 1/2 - 39 1/2"' },
    { label: "50 (M)", chest: '36 1/4 - 38 1/2"', waist: '30 3/4 - 32 3/4"', hip: '39 1/2 - 41 1/2"' },
    { label: "54 (L)", chest: '38 1/2 - 41"', waist: '32 3/4 - 35"', hip: '41 1/2 - 44"' },
    { label: "58 (XL)", chest: '41 - 43 1/2"', waist: '35 - 37 1/2"', hip: '44 - 46 1/2"' },
    { label: "62 (2XL)", chest: '43 1/2 - 46"', waist: '37 1/2 - 40"', hip: '46 1/2 - 49"' },
  ],
  cm: [
    { label: "34 (3XS)", chest: "73 - 78 cm", waist: "57 - 60 cm", hip: "81 - 85 cm" },
    { label: "38 (2XS)", chest: "78 - 82 cm", waist: "61 - 68 cm", hip: "86 - 91 cm" },
    { label: "42 (XS)", chest: "82 - 87 cm", waist: "68 - 73 cm", hip: "91 - 95 cm" },
    { label: "46 (S)", chest: "87 - 92 cm", waist: "73 - 78 cm", hip: "95 - 100 cm" },
    { label: "50 (M)", chest: "92 - 98 cm", waist: "78 - 83 cm", hip: "100 - 105 cm" },
    { label: "54 (L)", chest: "98 - 104 cm", waist: "83 - 89 cm", hip: "105 - 112 cm" },
    { label: "58 (XL)", chest: "104 - 110 cm", waist: "89 - 95 cm", hip: "112 - 118 cm" },
    { label: "62 (2XL)", chest: "110 - 117 cm", waist: "95 - 102 cm", hip: "118 - 124 cm" },
  ],
};

/** Map recommendation letter to product label suffix */
export const sizeLabelMap: Record<string, string> = {
  "3XS": "34 (3XS)",
  "2XS": "38 (2XS)",
  XS: "42 (XS)",
  S: "46 (S)",
  M: "50 (M)",
  L: "54 (L)",
  XL: "58 (XL)",
  "2XL": "62 (2XL)",
};
