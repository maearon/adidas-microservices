import type { SizeUnit } from "@/data/kids-shoes-size-chart";

export interface ApparelSizeColumn {
  label: string;
  chest: string;
  waist: string;
  hip: string;
}

export const mensShirtsTopsStandard: Record<SizeUnit, ApparelSizeColumn[]> = {
  inches: [
    { label: "XS", chest: '32 1/2–34"', waist: '27 1/2–29"', hip: '32–33 1/2"' },
    { label: "S", chest: '34 1/2–36"', waist: '29 1/2–31 1/2"', hip: '34–36"' },
    { label: "M", chest: '36 1/2–38"', waist: '31 1/2–33 1/2"', hip: '36–38"' },
    { label: "L", chest: '38 1/2–40 1/2"', waist: '33 1/2–35 1/2"', hip: '38–40"' },
    { label: "XL", chest: '40 1/2–43"', waist: '35 1/2–38"', hip: '40–42"' },
    { label: "2XL", chest: '43–45 1/2"', waist: '38–40 1/2"', hip: '42–44 1/2"' },
    { label: "3XL", chest: '45 1/2–48"', waist: '40 1/2–43"', hip: '44 1/2–47"' },
  ],
  cm: [
    { label: "XS", chest: "82–86 cm", waist: "70–74 cm", hip: "81–85 cm" },
    { label: "S", chest: "88–92 cm", waist: "75–80 cm", hip: "86–91 cm" },
    { label: "M", chest: "93–97 cm", waist: "80–85 cm", hip: "91–97 cm" },
    { label: "L", chest: "98–103 cm", waist: "85–90 cm", hip: "97–102 cm" },
    { label: "XL", chest: "103–109 cm", waist: "90–97 cm", hip: "102–107 cm" },
    { label: "2XL", chest: "109–116 cm", waist: "97–103 cm", hip: "107–113 cm" },
    { label: "3XL", chest: "116–122 cm", waist: "103–109 cm", hip: "113–119 cm" },
  ],
};

export const mensShirtsTopsTall: Record<SizeUnit, ApparelSizeColumn[]> = {
  inches: [
    { label: "S Tall", chest: '34 1/2–36"', waist: '29 1/2–31 1/2"', hip: '34–36"' },
    { label: "M Tall", chest: '36 1/2–39"', waist: '32–34 1/2"', hip: '36 1/2–39"' },
    { label: "L Tall", chest: '39–41 1/2"', waist: '34 1/2–37"', hip: '39–41 1/2"' },
    { label: "XL Tall", chest: '41 1/2–44"', waist: '37–39 1/2"', hip: '41 1/2–44"' },
    { label: "2XL Tall", chest: '44–46 1/2"', waist: '39 1/2–42"', hip: '44–46 1/2"' },
  ],
  cm: [
    { label: "S Tall", chest: "88–92 cm", waist: "75–80 cm", hip: "86–91 cm" },
    { label: "M Tall", chest: "93–99 cm", waist: "81–88 cm", hip: "93–99 cm" },
    { label: "L Tall", chest: "99–105 cm", waist: "88–94 cm", hip: "99–105 cm" },
    { label: "XL Tall", chest: "105–112 cm", waist: "94–100 cm", hip: "105–112 cm" },
    { label: "2XL Tall", chest: "112–118 cm", waist: "100–107 cm", hip: "112–118 cm" },
  ],
};

export const mensShirtsTopsShort: Record<SizeUnit, ApparelSizeColumn[]> = {
  inches: [
    { label: "XS Short", chest: '32 1/2–34"', waist: '27 1/2–29"', hip: '32–33 1/2"' },
    { label: "S Short", chest: '34 1/2–36"', waist: '29 1/2–31 1/2"', hip: '34–36"' },
    { label: "M Short", chest: '36 1/2–38"', waist: '31 1/2–33 1/2"', hip: '36–38"' },
    { label: "L Short", chest: '38 1/2–40 1/2"', waist: '33 1/2–35 1/2"', hip: '38–40"' },
    { label: "XL Short", chest: '40 1/2–43"', waist: '35 1/2–38"', hip: '40–42"' },
  ],
  cm: [
    { label: "XS Short", chest: "82–86 cm", waist: "70–74 cm", hip: "81–85 cm" },
    { label: "S Short", chest: "88–92 cm", waist: "75–80 cm", hip: "86–91 cm" },
    { label: "M Short", chest: "93–97 cm", waist: "80–85 cm", hip: "91–97 cm" },
    { label: "L Short", chest: "98–103 cm", waist: "85–90 cm", hip: "97–102 cm" },
    { label: "XL Short", chest: "103–109 cm", waist: "90–97 cm", hip: "102–107 cm" },
  ],
};

export interface SizeConversionRow {
  region: string;
  sizes: string[];
}

export const mensSizeConversion: SizeConversionRow[] = [
  { region: "UK", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
  { region: "IT", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
  { region: "FR", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
  { region: "EU", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
];

export const mensSizeConversionUsHeaders = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
