import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CategoryGrid() {
  const categories = [
    {
      title: "Giày Nam",
      image: "/placeholder.png?height=400&width=400",
      href: "/men/shoes",
    },
    {
      title: "Giày Nữ",
      image: "/placeholder.png?height=400&width=400",
      href: "/women/shoes",
    },
    {
      title: "Quần áo thể thao",
      image: "/placeholder.png?height=400&width=400",
      href: "/clothing",
    },
    {
      title: "Phụ kiện",
      image: "/placeholder.png?height=400&width=400",
      href: "/accessories",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Danh mục sản phẩm</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                  <div>
                    <h3 className="text-foreground text-xl font-bold mb-2">{category.title}</h3>
                    <Button variant="secondary" size="sm">
                      Khám phá
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
