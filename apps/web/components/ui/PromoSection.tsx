import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PromoSection() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">SALE UP TO 50%</h2>
            <p className="text-xl mb-8 text-gray-300">
              Giảm giá lên đến 50% cho các sản phẩm được chọn lọc. Cơ hội tuyệt vời để sở hữu những món đồ yêu thích.
            </p>
            <Link href="/sale">
              <Button size="lg" className="bg-background text-background hover:bg-gray-100">
                Mua ngay
              </Button>
            </Link>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/placeholder.png?height=600&width=800')" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
