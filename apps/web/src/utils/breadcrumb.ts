import { BreadcrumbItem } from "@/types/bread-crumb";
import { Product } from "@/types/product";
// import { getCategoryConfig, categoryConfigs } from "@/utils/category-config.auto"
import { capitalizeTitle } from "./sanitizeMenuTitleOnly";
import { slugify } from "@/lib/utils";

export function formatSlugTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function getBreadcrumbTrail(slug: string): BreadcrumbItem[] {
  const parts = slug.split("-");
  const hrefParts: string[] = [];

  const items: BreadcrumbItem[] = [
    ...parts.map((part) => {
      hrefParts.push(part);
      return {
        label: capitalizeTitle(part),
        href: `/${hrefParts.join("-")}`,
      };
    }),
  ];

  return items;
}

export function buildBreadcrumbFromProductItem(product: Product) {
  return [
    { label: "Home", href: "/" },
    { label: product.gender, href: `/${slugify(product.gender)}` },
    // { label: product.sport, href: `/${slugify(product.gender)}-${slugify(product.sport)}` },
    { label: product.category, href: `/${slugify(product.gender)}-${slugify(product.category)}` },
  ];
}

export function buildBreadcrumbFromProductDetail(product: Product) {
  return [
    // { label: "Home", href: "/" },
    product.sport
      ? { label: product.sport, href: `/${slugify(product.sport)}` }
      : { label: product.gender, href: `/${slugify(product.gender)}` },
    { label: product.category, href: `/${slugify(product.sport)}-${slugify(product.category)}` },
  ];
}
