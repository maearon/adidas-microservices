import { Prisma } from "@prisma/client";

export const FIELD_DICTIONARY: Record<string, keyof Prisma.productsWhereInput> = {
  // Gender
  men: "gender",
  women: "gender",
  kids: "gender",
  unisex: "gender",
  boys: "gender",
  girls: "gender",
  baby: "gender",
  babies: "gender",
  youth: "gender",
  children: "gender",

  // Category
  shoes: "category",
  clothing: "category",
  apparel: "category",
  accessories: "category",
  bags: "category",
  backpacks: "category",

  // Sport
  running: "sport",
  soccer: "sport",
  basketball: "sport",
  tennis: "sport",
  golf: "sport",
  football: "sport",
  baseball: "sport",
  cycling: "sport",
  hiking: "sport",
  motorsport: "sport",
  workout: "sport",
  gym: "sport",
  training: "sport",
  volleyball: "sport",
  yoga: "sport",
  rugby: "sport",
  swim: "sport",
  softball: "sport",
  skateboarding: "sport",
  weightlifting: "sport",
  cricket: "sport",

  // Activity
  outdoor: "activity",
  indoor: "activity",

  // Product type
  pants: "product_type",
  shorts: "product_type",
  "t-shirts": "product_type",
  tops: "product_type",
  hoodies: "product_type",
  sweatshirts: "product_type",
  jackets: "product_type",
  coats: "product_type",
  leggings: "product_type",
  tights: "product_type",
  tracksuits: "product_type",
  dresses: "product_type",
  skirts: "product_type",
  bras: "product_type",
  sets: "product_type",
  uniforms: "product_type",
  "slip-on": "product_type",
  sneakers: "product_type",

  // Material
  eco: "material",
  leather: "material",
  mesh: "material",
  cotton: "material",
  synthetic: "material",

  // Collection / Collabs
  adicolor: "collection",
  gazelle: "collection",
  samba: "collection",
  superstar: "collection",
  terrex: "collection",
  ultraboost: "collection",
  y3: "collection",
  originals: "collection",
  f50: "collection",
  adizero: "collection",
  forum: "collection",
  stan_smith: "collection",
  prada: "collection",
  disney: "collection",
  // ... thêm tiếp
};
