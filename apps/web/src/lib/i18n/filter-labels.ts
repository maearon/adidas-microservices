import type { FacetOption } from "@/types/product/filters"

/** Maps canonical English facet values → filter.json translation keys */
export const FACET_VALUE_I18N_KEYS: Record<string, string> = {
  // gender
  men: "men",
  women: "women",
  kids: "kids",
  unisex: "unisex",

  // category
  shoes: "shoes",
  clothing: "clothing",
  accessories: "accessories",

  // age
  youth_teens: "ageYouth",
  children: "ageChildren",
  babies_toddlers: "ageBabies",

  // sort (also used if needed)
  price_low_high: "priceLowHigh",
  price_high_low: "priceHighLow",
  newest: "newest",
  top_sellers: "topSellers",

  // shipping
  prime: "prime",

  // sports / activity
  running: "running",
  soccer: "soccer",
  basketball: "basketball",
  football: "football",
  golf: "golf",
  tennis: "tennis",
  baseball: "baseball",
  volleyball: "volleyball",
  cycling: "cycling",
  hiking: "hiking",
  outdoor: "outdoor",
  indoor: "indoor",
  gym: "gym",
  training: "training",
  workout: "workout",
  yoga: "yoga",
  motorsport: "motorsport",
  swim: "swim",
  softball: "softball",
  cricket: "cricket",
  rugby: "rugby",
  skateboarding: "skateboarding",
  weightlifting: "weightlifting",
  lifestyle: "lifestyle",
  dance: "dance",
  hiit: "hiit",
  climbing: "climbing",
  "mountain biking": "mountainBiking",
  "track & field": "trackAndField",
  boxing: "boxing",
  futsal: "futsal",
  "trail running": "trailRunning",
  casual: "casual",
  athletic: "athletic",

  // best for
  race: "race",
  everyday: "everyday",
  walking: "walking",
  marathon: "marathon",
  "rugged terrain": "ruggedTerrain",

  // surface / width
  road: "road",
  treadmill: "treadmill",
  trail: "trail",
  track: "track",
  medium: "medium",
  wide: "wide",

  // features
  "quick dry": "quickDry",
  "moisture wicking": "moistureWicking",
  stretch: "stretch",
  lightweight: "lightweight",
  breathable: "breathable",

  // brands
  originals: "originals",
  performance: "performance",
  sportswear: "sportswear",
  "y-3": "y3",
  "adidas by stella mccartney": "stellaMccartney",
  adidas: "adidas",
  "adidas-originals": "adidasOriginals",
  "adidas-performance": "adidasPerformance",

  // material
  mesh: "mesh",
  leather: "leather",
  synthetic: "synthetic",
  knit: "knit",
  canvas: "canvas",

  // collections
  adicolor: "adicolor",
  ultraboost: "ultraboost",
  samba: "samba",
  superstar: "superstar",
  gazelle: "gazelle",
  terrex: "terrex",
  adizero: "adizero",
  ultimate365: "ultimate365",
  "racket sports": "racketSports",
  clima: "clima",
  "all szn": "allSzn",
  ballerina: "ballerina",
  tiro: "tiro",
  adibreak: "adibreak",
  firebird: "firebird",
  adi365: "adi365",
  f50: "f50",
  "future icons": "futureIcons",
  hyperglam: "hyperglam",
  rdy: "rdy",
  y2k: "y2k",
  zenboost: "zenboost",
  runfalcon: "runfalcon",
  supernova: "supernova",
  hyperboost: "hyperboost",
  duramo: "duramo",

  // colors
  black: "black",
  white: "white",
  red: "red",
  blue: "blue",
  green: "green",
  gray: "gray",
  grey: "grey",
  yellow: "yellow",
  orange: "orange",
  purple: "purple",
  pink: "pink",
  beige: "beige",
  brown: "brown",
  silver: "silver",
  burgundy: "burgundy",
  turquoise: "turquoise",
  multi: "multi",
  multicolor: "multicolor",
}

export type FilterDict = Record<string, string | undefined>

export function translateFacetLabel(
  t: FilterDict | undefined,
  value: string,
  fallback?: string
): string {
  const key = FACET_VALUE_I18N_KEYS[value.trim().toLowerCase()]
  if (key && t?.[key]) return t[key] as string
  return fallback || value
}

export function translateFacetOptions(
  t: FilterDict | undefined,
  options: FacetOption[]
): FacetOption[] {
  return options.map((opt) => ({
    ...opt,
    label: translateFacetLabel(t, opt.value, opt.label),
  }))
}

export const SECTION_I18N_KEYS: Record<string, string> = {
  sort: "sortBy",
  shipping: "shipping",
  gender: "gender",
  age: "age",
  size: "size",
  category: "category",
  color: "color",
  best_for: "bestFor",
  sport: "sport",
  activity: "activity",
  collection: "collection",
  features: "features",
  brand: "brand",
  surface: "surface",
  width: "width",
  price: "price",
}
