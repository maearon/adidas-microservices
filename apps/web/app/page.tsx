"use client"

import ProductTabs from "@/components/product-tabs"
import PromoCarousel from "@/components/promo-carousel"
import { Button } from "@/components/ui/button"
import HeroBanner from "@/components/HeroBanner"
import { useAppSelector } from "@/store/hooks"
import { selectLocale } from "@/store/localeSlice"
import { getTranslations } from "@/lib/locale"
import HeroBannerSecond from "@/components/home/HeroBannerSecond"
import { useState, useEffect } from "react"
import PromoBanner from "@/components/home/PromoBanner"
import { ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Product } from "@/types/product"
import { newArrivalProducts } from "@/data/fake-new-arrival-products"
import { mockSlides } from "@/data/mock-slides-data"
import { relatedResources } from "@/data/related-resources-data"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import TileCard from "@/components/tile-card"
import ResourceCard from "@/components/resource-card"
import HeroBannerVideo from "@/components/home/HeroBannerVideo"

export default function HomePage() {
  const locale = useAppSelector(selectLocale)
  const t = getTranslations(locale, "hero")
  const [newArrivalProductsTab, setNewArrivalProductsTab] = useState<Product[]>([])

  useEffect(() => {
    try {
      setNewArrivalProductsTab(newArrivalProducts)
    } catch (err) {
      console.error("Failed to setNewArrivalProductsTab", err)
    }
  }, [])

  const newProducts = [
    {
      id: 5,
      name: "Real Madrid 24/25 Home Authentic Jersey",
      price: "$130",
      image: "/placeholder.png?height=300&width=250",
    },
    {
      id: 6,
      name: "Real Madrid 24/25 Home Jersey",
      price: "$90",
      image: "/placeholder.png?height=300&width=250",
    },
    {
      id: 7,
      name: "Samba OG Shoes",
      price: "$100",
      image: "/placeholder.png?height=300&width=250",
    },
    {
      id: 8,
      name: "Gazelle Shoes",
      price: "$100",
      image: "/placeholder.png?height=300&width=250",
    },
  ]

  const popularCategories = ["ultraboost", "samba", "campus", "soccer", "gazelle", "spezial"]

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <HeroBanner
        backgroundClassName="bg-hero"
        content={{
          title: t?.heroTitle ?? "A TRUE MIAMI ORIGINAL",
          description: t?.heroDesc ?? "Dream big and live blue in the iconic Inter Miami CF 2025 Third Jersey.",
          buttons: [
            {
              href: "/mls",
              buttonLabel: t?.shopNow ?? "SHOP NOW",
              border: false,
              shadow: true,
            },
          ],
        }}
      />
      
      <HeroBannerSecond />

      <HeroBannerVideo />

      <div className="mb-4"></div>

      {/* <PromoCarousel slides={mockSlides}/> */}
      <PromoCarousel
        items={mockSlides}
        renderItem={(slide, i) => (
          <TileCard tile={slide} index={i} />
        )}
      />
      
      {/* History Products Section */}
      <HistoryView
        title={
          <>
            STILL <br className="xl:hidden" /> INTERESTED?
          </>
        }
      />

      {/* Product Tabs Section */}
      <ProductTabs initialProductsByTab={{
        "new-arrivals": newArrivalProductsTab,
        "best-sellers": newArrivalProductsTab,
        "new-to-sale": newArrivalProductsTab,
      }} />

      {/* New Products Section */}
      {/* <section className="container mx-auto px-2 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <Badge className="bg-black text-white">New Arrivals</Badge>
            <span className="text-base text-gray-600">Best Sellers</span>
          </div>
          <Button variant="link" className="text-base font-bold">
            VIEW ALL
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivalProductsTab.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={{
                ...product,
                price: product.price ?? "N/A",
                image: product.image ?? "/placeholder.png",
              }}
            />
          ))}
        </div>
      </section> */}

      {/* Promo Tiles */}
      {/* <section className="container mx-auto px-1 sm:px-2 md:px-3 lg:px-10 xl:px-20 2xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockSlides.map((title, index) => (
            <Card key={`${title}-${index}`} className="relative overflow-hidden h-80 border-0 rounded-none">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('${title.image}')`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              </div>
              <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 className="font-bold text-lg mb-1">{title.title}</h3>
                {title.subtitle && <p className="text-base mb-2">{title.subtitle}</p>}
                <p className="text-base mb-4">{title.description}</p>
                <Button variant="outline" size="sm" className="border border-black text-black font-bold px-2 py-1 text-[11px] sm:text-xs rounded-none hover:bg-gray-100 transition w-fit">
                  {title.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Prime Section */}
      <section className="bg-black text-white py-8 mb-0">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-0">
          <Image
            src="/assets/resource/Prime_logo_d_c8da1e6868.png"
            alt="Prime Logo"
            width={160}
            height={60}
            className="w-32 sm:w-32 md:w-32 h-auto pb-6"
          />

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Fast, Free Delivery
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide pb-6">
            with Prime at adidas
          </h3>
          <Button 
            href="/prime" 
            loading={false} 
            shadow
            className="bg-white text-black py-3 rounded-none font-semibold hover:bg-gray-100 transition-colors"
          >
            SHOP NOW
          </Button>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-2 py-0">
        <h2 className="text-[32px] font-bold mb-4">Popular right now</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-6">
          {popularCategories.slice(0, 6).map((category, index) => (
            <Button
              shadow={false}
              key={`${category}-${index}`}
              variant="ghost"
              className="w-full justify-start text-left text-[44px] font-extrabold pb-10
                border-0 border-b border-black
                hover:shadow-[inset_0_-5px_0_0_black]
                hover:bg-transparent focus:bg-transparent active:bg-transparent
                rounded-none shadow-none transition-all duration-200"
              showArrow={false}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>
      <div className="mb-4"></div>

      {/* Related Resources */}
      {/* <section className="container mx-auto px-1 sm:px-2 md:px-3 lg:px-10 xl:px-20 2xl:px-20 py-0">
        <h4 className="text-[24px] font-bold mb-2">RELATED RESOURCES</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedResources.map((resource, index) => (
            <Card key={`${resource}-${index}`} className="border-none shadow-none">
              <CardContent className="p-0">
                <img
                  src={resource.image || "/placeholder.png"}
                  alt={resource.title}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="font-bold mb-2 text-base">{resource.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}

      {/* Related Resources Carousel */}
      <section className="container mx-auto px-2 py-0">
        <h4 className="text-[24px] font-bold mb-2">RELATED RESOURCES</h4>
        {/* <PromoCarousel slides={relatedResources}/> */}
        <PromoCarousel
          items={relatedResources}
          renderItem={(slide, i) => (
            <ResourceCard resource={slide} index={i} />
          )}
        />
      </section>

      {/* Footer Categories */}
      <PageFooter currentPage="home" />

      {/* Desktop-only black section with white text and centered content */}
      <section className="block bg-black text-white pt-14 pb-16">
        <div className="container mx-auto px-8 text-center">
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-bold mb-8 uppercase inline-block px-4 pt-3 tracking-wide">
            SNEAKERS, ACTIVEWEAR AND SPORTING GOODS
          </h2>

          <div className="max-w-2xl mx-auto text-base sm:text-md leading-relaxed space-y-4 text-left">
            <p>
              Calling all athletes. Gear up for your favorite sport with adidas sneakers and activewear for
              men and women. From running to soccer and the gym to the trail, performance workout clothes and shoes
              keep you feeling your best. Find sport-specific sneakers to support your passion, and shop versatile
              activewear and accessories that support everyday comfort. adidas has you covered with world-class
              performance, quality and unmatched comfort to fit your style. Explore the full range of adidas gear today.
            </p>
            <p>
              Founded on performance, adidas sporting goods equipment supports athletes at all levels. Men,
              women and kids will find their best form in sneakers and activewear made to perform under pressure.
              adidas sportswear breathes, manages sweat and helps support working muscles. Explore sport-specific
              clothes and gear for basketball, soccer, or the yoga studio. Runners will find a range of sneakers
              for training, racing and trail runs. Gym users will find tops, tees and tanks that support focused
              efforts with adidas CLIMACOOL to feel cool and dry.
            </p>
            <p>
              Explore warm-ups featuring four-way stretch to support mobility. Find a new outdoor jacket that
              helps protect against wind and rain. Lace up new athletic shoes that energize every step with
              adidas Boost cushioning. With sizes and styles for all ages, we have sporting goods for the whole
              family. Dedicated training demands dedicated workout clothes. Experience the latest performance
              fabrics and sneaker technologies to get the most out of your next training session.
            </p>
          </div>

          <div className="mt-12">
            <img
              src="/logo-white.png"
              alt="Adidas Logo"
              className="mx-auto w-20"
            />
          </div>
        </div>
      </section>

    </div>
  )
}
