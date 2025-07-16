import KidsPromoCarousel from "@/app/kids/KidsPromoCarousel"
import HeroBanner from "@/components/HeroBanner"
import ProductCarousel from "@/components/product-carousel"
import { newArrivalProducts } from "@/data/fake-new-arrival-products"
import HistoryView from "@/components/HistoryView"
import PageFooter from "@/components/page-footer"
import { Slide } from "@/components/promo-carousel"

// app/kids/page.tsx
export const metadata = {
  title: "👕Kids' Sneakers and Activewear | adidas US👕",
  description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
};

export default function KidsPage() {
  const categoryTiles = [
    { title: "YOUTH AND TEENS", image: "/assets/kids/samba-og-shoes-kids.png?height=200&width=300", href: "/men-shoes" },
    { title: "CHILDREN", image: "/assets/kids/samba-og-shoes-kids.png?height=200&width=300", href: "/men-tops" },
    { title: "INFANTS & TODDLERS", image: "/assets/kids/vl-court-3.0-shoes-kids.jpg?height=200&width=300", href: "/men-hoodies" },
    { title: "ALL KIDS", image: "/assets/kids/samba-og-shoes-kids.jpg?height=200&width=300", href: "/men-pants" },
  ]

  const promoTiles: Slide[] = [
    {
      title: "NEW ARRIVALS",
      description: "",
      image: "/assets/kids/ss25_ccrd_kids_glp_new_1_d_2baaccada6.jpg",
      href: "/products/adizero-evo-sl",
    },
    {
      title: "LIFESTYLE",
      description: "",
      image: "/assets/kids/ss25_ccrd_kids_glp_lifestyle_2_d_7ac0b03fc1.jpg",
      href: "/products/campus",
    },
    {
      title: "SHOES",
      description: "",
      image: "/assets/kids/ss25_ccrd_kids_glp_shoes_3_d_a07b81c4b0.jpg",
      href: "/products/real-madrid-25-26",
    },
    {
      title: "FAMILY MATCHING",
      description: "",
      image: "/assets/kids/ss25_ccrd_kids_glp_fammatch_4_d_8cd85b7184.jpg",
      href: "/products/dropset-3",
    },
  ];

  // const topPicks = [
  //   { id: 1, name: "Samba OG Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  //   { id: 2, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
  //   { id: 3, name: "Ultraboost 22 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
  //   { id: 4, name: "Gazelle Indoor Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  // ]

  const recentlyViewed = [
    {
      id: 1,
      name: "Real Madrid 23/24 Home Authentic Jersey",
      price: "$130",
      image: "/placeholder.png?height=300&width=250",
    },
    { id: 2, name: "Essentials Hoodie", price: "$65", image: "/placeholder.png?height=300&width=250" },
    { id: 3, name: "Adizero EVO SL Shoes", price: "$130", image: "/placeholder.png?height=300&width=250" },
    { id: 4, name: "Adizero F50 FG Shoes", price: "$280", image: "/placeholder.png?height=300&width=250" },
  ]

  const menCategories = {
    "MEN'S CLOTHINGgggg": ["T-shirts", "Hoodies", "Sweatshirts", "Jackets", "Pants & Joggers", "Shorts"],
    "MEN'S SHOES": ["Shoes", "High Top Sneakers", "Low Top Sneakers", "Slip On Sneakers", "All White Sneakers"],
    "MEN'S ACCESSORIES": ["Men's Accessories", "Men's Socks", "Men's Bags", "Men's Hats", "Men's Headphones"],
    "MEN'S COLLECTIONS": [
      "Men's Running",
      "Men's Soccer",
      "Men's Loungewear",
      "Men's Training & Gym",
      "Men's Originals",
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      {/* <Header /> */}

      <HeroBanner
        backgroundClassName="bg-hero-kids"
        content={{
          title: "WE ARE SO BACK",
          description: "Get their back to school looks down this year with tracksuits, sneakers, and more.",
          buttons: [
            { 
              href: "/kids-back_to_schools", 
              buttonLabel: "SHOP NOW",
              border: false,
              shadow: true,
            }
          ],
        }}
      />

      
      {/* Promo Tiles */}
      <KidsPromoCarousel items={promoTiles} />

      {/* Category Tiles */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryTiles.map((category, index) => (
            <a
              key={index}
              href={category.href}
              className="flex flex-col items-center bg-[#EAEEEF] p-4 pt-0 hover:shadow-lg transition"
            >
              {/* Image block */}
              <div className="w-[160px] h-[160px] bg-white mb-4 flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-black text-sm font-bold underline uppercase text-center">
                {category.title}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* Top Picks */}
      {/* <section className="container mx-auto px-2 py-4">
        <h2 className="text-xl font-bold mb-4">TOP PICKS FOR YOU</h2>
        <div className="grid grid-cols-4 gap-6">
          {topPicks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
      {/* Top Picks */}
      {/* Top Picks */}
      <section className="container mx-auto px-2">
        <h2 className="text-xl font-bold mb-4">TOP PICKS FOR YOU</h2>

        <ProductCarousel
          products={newArrivalProducts}
        />
      </section>


      {/* Men's Description */}
      <section className="container mx-auto px-2 py-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Kids' Shoes and Activewear</h2>
        <div className="max-w-4xl mx-auto text-gray-700 text-sm leading-relaxed space-y-4">
          <p>
            Aspiring sports stars and busy kids deserve the best. Explore kids' sneakers and sportswear for active girls and boys. Fulfill their sports dreams with matching kids' activewear and warm-ups that fit and feel great from the classroom to the playground, the gym, and home. Enjoy the best selection of comfy kids' clothes and sneakers to keep your young athlete excited to exercise and play their best. Discover the latest trends and heritage adidas styles in kids' athletic clothes, sneakers, cleats and accessories.
          </p>
        </div>
      </section>

      {/* Recently Viewed */}
      {/* <section className="container mx-auto px-2 py-4">
        <h2 className="text-xl font-bold mb-4">RECENTLY VIEWED ITEMS</h2>
        <div className="grid grid-cols-4 gap-6">
          {recentlyViewed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section> */}
      <HistoryView
        title={
          <>
            RECENTLY VIEWED ITEMS
          </>
        }
        showIndicatorsInProductCarousel={true}
      />

      {/* Men's Categories Footer */}
      {/* <section className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {Object.entries(menCategories).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold mb-4 text-sm">{category}</h3>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-sm text-gray-600 hover:underline">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <Footer /> */}
      <PageFooter currentPage="kids" />
    </div>
  )
}
