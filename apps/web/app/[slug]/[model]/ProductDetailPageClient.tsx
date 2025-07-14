// ProductDetailPageClient.tsx
"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { toggleWishlist } from "@/store/wishlistSlice"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, ChevronUp, Heart } from "lucide-react"
import ExpandableImageGallery from "@/components/expandable-image-gallery"
import ProductCarousel from "@/components/product-carousel"
import HistoryView from "@/components/HistoryView"
import { useProductDetail } from "@/api/hooks/useProducts"
import { slugify } from "@/utils/slugtify"
import { upperWords } from "@/utils/upper-words"
import { Variant } from "@/types/product"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { BaseButton } from "@/components/ui/base-button"

export default function ProductDetailPageClient({ params }: { params: { slug: string; model: string } }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [expandedSections, setExpandedSections] = useState({ reviews: false, description: false, details: false })
  const [sizeError, setSizeError] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<any>(null)

  const { data: product, isLoading, error, refetch } = useProductDetail(params.slug, params.model)

  useEffect(() => {
    if (!product) return
    setIsWishlisted(wishlistItems.some((item) => Number(item.id) === Number(product.id)))
    setCurrentVariant(product.variants[selectedVariant])
  }, [product, selectedVariant, wishlistItems])

  const variant = useMemo<Variant | undefined>(() => product?.variants.find((v) => v.variant_code === params.model), [product, params.model])
  const sizes = useMemo(() => variant?.sizes ?? [], [variant])

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSizeError("")
  }

  const handleAddToBag = () => {
    if (!selectedSize) return setSizeError("Please select your size")
    if (!product || !currentVariant) return
    dispatch(
      addToCart({
        id: Number(product.id),
        name: product.name,
        price: `$${variant?.price}`,
        image: variant?.image_urls?.[0] || "/placeholder.png",
        color: variant?.color,
        size: selectedSize,
      })
    )
  }

  const handleToggleWishlist = () => {
    if (!product || !currentVariant) return
    dispatch(
      toggleWishlist({
        id: Number(product.id),
        name: product.name,
        price: `$${variant?.price}`,
        image: variant?.image_urls?.[0] || "/placeholder.png",
      })
    )
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ reviews: false, description: false, details: false, [section]: !prev[section] }))
  }

  // Mock product details
  const productDetails = {
    rating: 4.8,
    reviewCount: 1247,
    features: ["Get delivery dates", "Free standard shipping with adiClub", "Free 30 day returns"],
    description:
      "A lightweight boot with a soft touch, built to match Leo's fit and feel. Embodying the prestige of the game's ultimate icon. For players with leather-like feet, their flexible Hybridtouch upper comes with a knit 'burrito' tongue for a wider opening and comfortable fit. The Sprintframe 360 outsole is built for quick feet on dry grass surfaces.",
    details: [
      "Regular fit",
      "Lace closure",
      "Hybrid Touch upper",
      "adidas PRIMEKNIT collar",
      "Sprintframe 360 firm ground outsole",
      "Imported",
      `Product color: ${variant?.color}`,
      `Product code: ${variant?.variant_code}`,
    ],
    sizeGuide: "True to size. We recommend ordering your usual size.",
    breadcrumb: "Home / Women / Soccer",
    sizes: [
      "4",
      "4.5",
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
      "12.5",
      "13",
      "13.5",
    ],
  }

  // ⛔ Handle lỗi sớm trước
  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Product not available</h2>
        <p className="text-gray-600 mb-4">
          We couldn’t load this product. Please check your connection or try again later.
        </p>
        <BaseButton onClick={() => refetch()}>Retry</BaseButton>
        <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-sm text-gray-500">
          ← Go Back
        </BaseButton>
      </div>
    )
  }

  // ⏳ Loading thực sự (lần đầu hoặc đang loading dữ liệu mới)
  if (isLoading || !product) {
    return <FullScreenLoader />
  }

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 py-6 lg:flex gap-12">
      {/* <div className="flex flex-col lg:flex-row gap-8 items-start"> */}
        {/* Left Column */}
        <div className="w-full lg:w-2/3">
          {/* Image Gallery */}
          <ExpandableImageGallery images={variant?.image_urls || []} productName={product.name} product={product} tags={product?.tags || []}/>

          {/* Expandable Sections */}
          <div className="space-y-8 mt-12">
            {/* Expandable Sections - Full Width Below Main Content */}
            <div className="max-w-none mx-auto space-y-0 my-16 border-t sm:mt-24">
              {/* Reviews */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection("reviews")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>Reviews ({productDetails.reviewCount})</span>
                  {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.reviews && (
                  <div className="pb-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold">{productDetails.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.floor(productDetails.rating) ? "fill-green-500 text-green-500" : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="mb-4 border-black text-black bg-transparent hover:bg-white hover:text-gray-500 rounded-none">
                      WRITE A REVIEW
                    </Button>
                    <p className="text-gray-600">Customer reviews and ratings would appear here.</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>Description</span>
                  {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.description && (
                  <div className="pb-6">
                    <p className="text-gray-600 leading-relaxed">{productDetails.description}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="border-b">
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>Details</span>
                  {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.details && (
                  <div className="pb-6">
                    <ul className="space-y-2">
                      {productDetails.details.map((detail, index) => (
                        <li key={index} className="text-gray-600">
                          • {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Section */}
            <div className="mt-16 bg-gray-50 p-8 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    LIGHTWEIGHT F50 CLEATS FOR SHOWING NON-STOP MESSI SKILLS ON FIRM GROUND
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Engineered for speed, these F50 Laceless Boots feature a lightweight Fiberskin upper and Sprintframe
                    outsole for explosive acceleration. The laceless construction provides a clean ball contact surface,
                    while Messi signature details celebrate the GOAT.
                  </p>
                </div>
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="F50 Messi lifestyle"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* F50 Messi Prestigio Section */}
            <div className="mt-16 bg-black text-white p-8 rounded-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">F50 MESSI PRESTIGIO</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  A lightweight boot with a soft touch, built to match Lionel's style on the pitch. Featuring the speed of
                  the F50 with a premium look.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <img src="/placeholder.svg?height=300&width=300" alt="F50 Messi 1" className="w-full rounded-lg" />
                  <img src="/placeholder.svg?height=300&width=300" alt="F50 Messi 2" className="w-full rounded-lg" />
                  <img src="/placeholder.svg?height=300&width=300" alt="F50 Messi 3" className="w-full rounded-lg" />
                </div>
              </div>
            </div>

            <ProductCarousel products={product.related_products} title="COMPLETE THE LOOK" carouselModeInMobile minimalMobileForProductCard />
            <ProductCarousel products={product.related_products} title="YOU MAY ALSO LIKE" carouselModeInMobile minimalMobileForProductCard />
            <HistoryView title="RECENTLY VIEWED ITEMS" showIndicatorsInProductCarousel={false} />
            <div id="sticky-stopper" className="h-1 w-full" /> {/* Thêm div giả để quan sát chạm đáy */}
          </div>

        </div>

        {/* Right Column */}
        <aside className="w-full lg:w-1/3">

          <div className="sticky top-4 bg-white p-4 rounded-none shadow">

            {/* Mobile Product Title */}
            <div className="sm:hidden">
              <h1 className="text-xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold">${product.price}</span>
                {product.badge === "Best seller" && (
                  <Badge className="bg-gray-300 text-black text-xs rounded-none">BEST SELLER</Badge>
                )}
              </div>
            </div>

            {/* Desktop Product Title */}
            <div className="hidden sm:block">
              {/* Gender • Sport + Reviews */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  {product.gender ? `${product.gender}'s` : ''} 
                  {product.gender && product.sport ? ' • ' : ''}
                  {product.sport}
                </p>
                
                {/* Rating and Reviews */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(productDetails.rating) ? "fill-green-500 text-green-500" : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{productDetails.reviewCount}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4 leading-tight">{upperWords(product.name)}</h1>

              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl font-bold">${variant?.price}</span>
                {variant?.compare_at_price && (
                  <span className="text-lg text-gray-500 line-through">${variant?.compare_at_price}</span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-6">Promo codes will not apply to this product.</p>
            </div>


            {/* Colors */}
            <div>
              <h3 className="mb-3">{variant?.color}</h3>
              <div className="flex gap-2 mb-6">
                {product.variants.map((v) => {
                  const isActive = v.variant_code === params.model
                  return (
                    <Link
                      key={v.id}
                      href={`/${slugify(product.name)}/${v.variant_code}.html`}
                      className={`
                        w-12 h-12 overflow-hidden block
                        border-b-4
                        ${isActive ? "border-black" : "border-transparent hover:border-black"}
                      `}
                    >
                      <img
                        src={v.image_urls?.[0] || "/placeholder.svg"}
                        alt={v.color}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Sizes</h3>
                <button className="text-sm underline flex items-center">
                  <span className="mr-1">📏</span>
                  Size guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((size, index) => (
                  <button
                    key={`${size}-${index}`}
                    onClick={() => handleSizeSelect(size)}
                    className={`py-3 border text-center font-medium text-sm rounded-none ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {sizeError && <p className="text-red-600 text-sm mt-2 font-medium">{sizeError}</p>}
              <div className="mt-3 p-3 border border-gray-300 rounded-none">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">ℹ️</span>
                  <span>
                    <strong>True to size.</strong> We recommend ordering your usual size.
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Bag & Wishlist - Side by Side */}
            <div className="flex gap-4">
              <Button
                pressEffect={true}
                onClick={handleAddToBag}
                fullWidth={true}
              >
                ADD TO BAG
              </Button>

              <button
                onClick={handleToggleWishlist}
                className="w-12 h-12 border border-black rounded-none flex items-center justify-center hover:bg-white hover:text-black transition-colors translate-y-[3px]"
              >
                <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>From $24.24/month, or 4 payments at 0% interest with</p>
              <button className="underline font-medium">Klarna Learn more</button>
            </div>

            {/* Features */}
            <div className="space-y-2">
              {productDetails.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="text-blue-600">📦</span>
                  <span className="underline">{feature}</span>
                </div>
              ))}
            </div>

          </div>

        </aside>
      {/* </div> */}
    </main>
  )
}
