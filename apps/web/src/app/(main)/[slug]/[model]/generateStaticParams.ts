// /[slug]/[model].html/generateStaticParams.ts
import { fakeLastVisitedProducts } from "@/data/fake-last-visited-products"

export function generateStaticParams() {
  return fakeLastVisitedProducts.map((item) => {
    const parts = item.url.split("/") // /us/adifom-stan-smith-mule-shoes/JX5160.html
    const slug = parts[2]
    const modelWithHtml = parts[3] // JX5160.html
    const model = modelWithHtml.replace(".html", "")
    return { slug, model }
  })
}
