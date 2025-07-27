// ProductDetailPageClient.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { toggleWishlist } from "@/store/wishlistSlice"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, ChevronUp, Heart, CreditCard, RefreshCw, Truck, Info, Bell, BellRing } from "lucide-react"
import ExpandableImageGallery from "@/components/expandable-image-gallery"
import ProductCarousel from "@/components/product-carousel"
import HistoryView from "@/components/HistoryView"
import { useProductDetail } from "@/api/hooks/useProducts"
import { slugify } from "@/utils/slugtify"
import { upperWords } from "@/utils/upper-words"
import { Variant } from "@/types/product"
import Loading from "@/components/loading"
import { BaseButton } from "@/components/ui/base-button"
import Image from "next/image"
import { ButtonWish } from "@/components/ui/button-wish"

interface ProductDetailPageClientProps {
  params: {
    slug: string;
    model: string;
  };
}

export default function ProductDetailPageClient({ params }: ProductDetailPageClientProps) {
  // const parsedParams = typeof params === 'string' ? JSON.parse(params) : params;
  const { slug, model } = params;
//   useEffect(() => {
//   window.scrollTo({ top: 0, behavior: "auto" });
// }, []);
  const router = useRouter()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [expandedSections, setExpandedSections] = useState({ reviews: false, description: false, details: false })
  const [sizeError, setSizeError] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<any>(null)

  const { data: product, isLoading, error, refetch } = useProductDetail(slug, model)

  useEffect(() => {
    if (!product) return
    setIsWishlisted(wishlistItems.some((item) => Number(item.id) === Number(product.id)))
    setCurrentVariant(product.variants[selectedVariant])
  }, [product, selectedVariant, wishlistItems])

  const variant = product?.variants.find((v) => v.variant_code === params.model)
  const sizes = variant?.sizes ?? []

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
    soldOutSizes: ["36", "36.5", "37", "42.5"],
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
        <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
          ← Go Back
        </BaseButton>
      </div>
    )
  }

  // ⏳ Loading thực sự (lần đầu hoặc đang loading dữ liệu mới)
  if (isLoading || !product) {
    return <Loading />;
  }

  return (
    <main className="w-full mx-0 lg:flex">
      {/* <div className="flex flex-col lg:flex-row gap-8 items-start"> */}
        {/* Left Column */}
        <div className="w-full lg:w-2/3">
          {/* Image Gallery */}
          <ExpandableImageGallery variant={variant} product={product} images={variant?.image_urls || []} productName={product.name} tags={product?.tags || []}/>

          {/* Expandable Sections */}
          <div className="hidden sm:block mt-[80px] sm:px-[20px]">
            {/* Expandable Sections - Full Width Below Main Content */}
            <div className="max-w-none mx-0 space-y-0 my-16 border-t sm:mt-24">
              {/* Reviews */}
              <div className="border-b px-[15px] px-[30px]">
                <button
                  onClick={() => toggleSection("reviews")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>Reviews ({productDetails.reviewCount})</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold">{productDetails.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(productDetails.rating)
                              ? "fill-green-500 text-green-500"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
                  </div>
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
              <div className="border-b px-[15px] px-[30px]">
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
              <div className="border-b px-[15px] px-[30px]">
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
          </div>

          {/* Mid-page Promotional Banner */}
          {/* F50 Messi Prestigio Section */}
          <div className="hidden mt-[80px] pt-[6px] relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-white text-center overflow-hidden">
            <Image
              src="/assets/product/football_fw25_messi_pdp_launch_d_1213df14f1.jpg?height=500&width=1200"
              alt="F50 Messi Prestigio"
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
              className="z-0"
              sizes="100vw"
            />
          </div>
          {/* Feature Section */}
          <div className="hidden relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-white text-center overflow-hidden">
            <Image
              src="/assets/product/football_fw25_messi_statement_launch_d_9ba1aa6a05.jpg?height=500&width=1200"
              alt="F50 Messi Prestigio"
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
              className="z-0"
              sizes="100vw"
            />
            <div className="z-10 p-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">F50 MESSI PRESTIGIO</h2>
              <p className="text-base sm:text-lgmx-0">
                A lightweight boot with a soft touch built to match Leo's fit. Embodying the prestige in the game's dominant
                icon.
              </p>
            </div>
          </div>

          <div className="mb-0 sm:mb-[80px]"></div>

          {/* Product Carousel */}
          <div className="hidden sm:block sm:mb-[80px]">
          <ProductCarousel products={product.related_products} title="COMPLETE THE LOOK" carouselModeInMobile minimalMobileForProductCard showIndicators={false} />
          <div className="mb-[80px]"></div>
          <ProductCarousel products={product.related_products} title="YOU MAY ALSO LIKE" carouselModeInMobile minimalMobileForProductCard showIndicators />
          <div className="mb-[80px]"></div>
          <HistoryView title="RECENTLY VIEWED ITEMS" showIndicatorsInProductCarousel={false} />
          <div id="sticky-stopper" className="h-1 w-full" /> {/* Thêm div giả để quan sát chạm đáy */}
          </div>

        </div>

        {/* Right Column */}
        <aside className="w-full lg:w-1/3">

          <div className="sticky top-4 bg-white p-4 rounded-none border-l px-[20px] sm:px-12">

            {/* Desktop Product Title */}
            <div className="hidden sm:block">
              {/* Gender • Sport + Reviews */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-base text-gray-600">
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
                  <span className="text-base font-bold">{productDetails.reviewCount}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4 leading-tight">{upperWords(product.name)}</h1>

              <div className="flex items-center space-x-2 mb-6">
                <span className="text-2xl font-bold">${variant?.price}</span>
                {variant?.compare_at_price && (
                  <span className="text-lg text-gray-500 line-through">${variant?.compare_at_price}</span>
                )}
              </div>

              <p className="text-base text-black mb-6">Promo codes will not apply to this product.</p>
            </div>

            <div className="flex sm:hidden mt-[40px]">
                <p className="text-base text-black mb-6">Promo codes will not apply to this product.</p>
            </div>


            {/* Colors */}
            <div>
              <h3 className="mb-3">{variant?.color}</h3>
              <div className="flex gap-2 mb-6">
                {product.variants.map((variant) => {
                  const isActive = variant.variant_code === params.model
                  return (
                    <Link
                      key={variant.id}
                      href={`/${slugify(product.name)}/${variant.variant_code}.html`}
                      className={`
                        w-12 h-12 overflow-hidden block
                        border-b-4
                        ${isActive ? "border-black" : "border-transparent hover:border-black"}
                      `}
                    >
                      <img
                        src={variant?.image_urls?.[0] || "/placeholder.svg"}
                        alt={variant.color}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mt-[40px]">
                <h3 className="font-bold text-base">Sizes</h3>
                <button className="text-sm underline flex items-center text-black hover:opacity-80">
                  <span className="mr-1">📏</span>
                  Size guide
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2 mt-[10px]">
                {[...sizes].sort((a, b) => a.localeCompare(b)).map((size, index) => {
                  const isSoldOut = productDetails.soldOutSizes.includes(size);
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={`${size}-${index}`}
                      onClick={() => handleSizeSelect(size)}
                      disabled={isSoldOut}
                      className={`
                        relative py-3 border text-center text-sm font-medium rounded-none
                        ${isSelected ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"}
                        ${isSoldOut ? "text-gray-400 cursor-not-allowed" : ""}
                      `}
                    >
                      {size}
                      {isSoldOut && (
                        <span className="absolute top-1 right-0.5 text-xs">
                          {/* 🔔 */}
                          <BellRing className="absolute top-1 right-0.5 w-4 h-4 text-black" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="text-red-600 text-sm mt-2 font-medium">{sizeError}</p>
              )}

              <div className="mt-4 p-3 border border-gray-300 rounded-none bg-white text-sm">
                <div className="flex items-start text-gray-700 leading-snug">
                  <span className="mr-2 mt-[2px] text-black">
                    {/* ℹ️ */}
                    <Info className="text-black w-4 h-4 mr-2" />
                  </span>
                  <span>
                    <strong>True to size.</strong> We recommend ordering your usual size.
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Bag & Wishlist - Side by Side */}
            <div className="flex gap-4  mt-6">
              <Button
                theme="black"
                pressEffect
                onClick={handleAddToBag}
                fullWidth
              >
                ADD TO BAG
              </Button>

              <ButtonWish
                shadow={false}
                showArrow={false}
                onClick={handleToggleWishlist}
                className="w-12 h-12 border border-black rounded-none flex items-center justify-center hover:bg-white hover:text-black transition-colors translate-y-[3px]"
              >
                <Heart className={`w-[22px] h-[22px] ${isWishlisted ? "fill-current" : ""}`} />
              </ButtonWish>
            </div>

            {/* Klarna Payment */}
            <div className="flex flex-wrap items-center text-base text-gray-700 mt-6">
              <p className="mr-1">
                From <span className="font-bold">$24.24/month</span>, or 4 payments at 0% interest with
              </p>
              <span className="font-medium">
                <span className="font-bold">Klarna</span>{" "}
                <Link href="#" className="underline">
                  Learn more
                </Link>
              </span>
            </div>

            {/* Gray divider dash */}
            <div className="border-t border-gray-200 my-4" />

            <div className="flex items-center gap-3 text-gray-700 underline ">
              <RefreshCw className="h-5 w-5" />
              <div className="cursor-pointer hover:underline hover:bg-black hover:text-white">
                <p className="font-medium">Get delivery dates</p>
              </div>
            </div>

            {/* Gray divider dash */}
            <div className="border-t border-gray-200 my-4" />

            {/* Features */}
            <div className="flex items-center gap-3 text-black">
              <Truck className="h-5 w-5" />
              <div>
                <Link href="#" className="underline">
                <p className="text-base">Free standard shipping with adiClub</p>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 text-black">
              <CreditCard className="h-5 w-5" />
              <div>
                <Link href="#" className="underline">
                <p className="text-base">Free 30 day returns</p>
                </Link>
              </div>
            </div>

          </div>
        </aside>

        {/* Expandable Sections */}
        <div className="block sm:hidden mt-[80px] sm:px-[20px]">
          {/* Expandable Sections - Full Width Below Main Content */}
          <div className="max-w-none mx-0 space-y-0 my-16 border-t sm:mt-24">
            {/* Reviews */}
            <div className="border-b px-[15px] px-[30px]">
              <button
                onClick={() => toggleSection("reviews")}
                className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
              >
                <span>Reviews ({productDetails.reviewCount})</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold">{productDetails.rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(productDetails.rating)
                            ? "fill-green-500 text-green-500"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
                </div>
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
            <div className="border-b px-[15px] px-[30px]">
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
            <div className="border-b px-[15px] px-[30px]">
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
        </div>

        {/* Mid-page Promotional Banner */}
        {/* F50 Messi Prestigio Section */}
        <div className="flex sm:hidden mt-[80px] pt-[6px] relative w-full h-[582px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-white text-center overflow-hidden">
          <Image
            src="/assets/product/football_fw25_messi_pdp_launch_m_ba9cdf23e1.jpg?height=1004&width=750"
            alt="F50 Messi Prestigio"
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            className="z-0"
            sizes="100vw"
          />
        </div>
        {/* Feature Section */}
        <div className="flex sm:hidden relative w-full h-[402px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-white text-center overflow-hidden">
          <Image
            src="/assets/product/football_fw25_messi_statement_launch_m_74db237251.jpg?height=1004&width=750"
            alt="F50 Messi Prestigio"
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            className="z-0"
            sizes="100vw"
          />
          <div className="z-10 p-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">F50 MESSI PRESTIGIO</h2>
            <p className="text-base sm:text-lgmx-0">
              A lightweight boot with a soft touch built to match Leo's fit. Embodying the prestige in the game's dominant
              icon.
            </p>
          </div>
        </div>

        <div className="block sm:hidden mb-[80px]"></div>

        {/* Product Carousel */}
        <div className="block sm:hidden sm:block mb-[60px]">
        <ProductCarousel products={product.related_products} title="COMPLETE THE LOOK" carouselModeInMobile showIndicators={false} />
        <div className="mb-[60px]"></div>
        <ProductCarousel products={product.related_products} title="YOU MAY ALSO LIKE" carouselModeInMobile showIndicators />
        <div className="mb-[60px]"></div>
        <HistoryView title="RECENTLY VIEWED ITEMS" showIndicatorsInProductCarousel={false} />
        <div id="sticky-stopper" className="h-1 w-full" /> {/* Thêm div giả để quan sát chạm đáy */}
        </div>
      {/* </div> */}
    </main>
  )
}
