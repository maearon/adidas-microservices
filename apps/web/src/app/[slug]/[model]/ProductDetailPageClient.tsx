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
import { slugify } from "@/utils/slugify"
import { upperWords } from "@/utils/upper-words"
import { ProductDetails, Variant } from "@/types/product"
import Loading from "@/components/loading"
import { BaseButton } from "@/components/ui/base-button"
import Image from "next/image"
import { ButtonWish } from "@/components/ui/button-wish"
import { cn, formatPrice } from "@/lib/utils"
import ProductPrice from "@/components/ProductCardPrice"
import { addLastVisited } from "@/lib/recentlyViewed"
import { mapProductDataToProduct } from "@/lib/mappers/product-data-to-product"
import { useTranslations } from "@/hooks/useTranslations"

interface ProductDetailPageClientProps {
  params: {
    slug: string;
    model: string;
  };
}

export default function ProductDetailPageClient({ params }: ProductDetailPageClientProps) {
  // const parsedParams = typeof params === 'string' ? JSON.parse(params) : params;
  const { slug, model } = params;
  const t = useTranslations("productDetail")
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  const router = useRouter()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    reviews: false,
    description: false,
    details: false,
    highlights: false, // 👈 thêm
  })
  const [sizeError, setSizeError] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<any>(null)

  const { data: product, isLoading, error, refetch } = useProductDetail(slug, model)

  useEffect(() => {
    if (!product) return
    setIsWishlisted(wishlistItems.some((item) => Number(item.id) === Number(product.id)))
    setCurrentVariant(product.variants[selectedVariant])
  }, [product, selectedVariant, wishlistItems])

  // Thêm sản phẩm vào Recently Viewed
  useEffect(() => {
    // Map API response to Product type
    if (product) addLastVisited(mapProductDataToProduct(product))
  }, [product])

  const variant = product?.variants.find((v) => v.variant_code === params.model)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const displayColor = hoveredColor || variant?.color
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
        price: Number(variant?.price ?? 0),
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
        price: `$${formatPrice(variant?.price).replace("$", "")}`,
        image: variant?.image_urls?.[0] || "/placeholder.png",
      })
    )
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      reviews: false,
      description: false,
      details: false,
      highlights: false,        // 👈 reset thêm key mới
      [section]: !prev[section],
    }))
  }

  // Mock product details
  const productDetails: ProductDetails = {
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
    highlights: [
      {
        title: "ACCELERATE STRONGER",
        text: "Sprintframe 360 soleplate lets you explode off the mark, just like Messi breaking past defenders.",
      },
      {
        title: "FIT LIKE MESSI",
        text: "HybridTouch suede upper and burrito tongue match Messi’s preferred comfort and lockdown.",
      },
      {
        title: "DRIBBLE FAST",
        text: "Materials tuned to Messi’s playing style deliver lightweight, cushioned control.",
      },
      {
        title: "EXPERIENCE LEVEL",
        text: "Elite Level cleats are crafted for competition at an advanced level.",
      },
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-2">{t?.productNotAvailable || "Product not available"}</h2>
        <p className="text-gray-600 dark:text-white mb-4">
          {t?.couldNotLoadProduct || "We couldn't load this product. Please check your connection or try again later."}
        </p>
        <BaseButton onClick={() => refetch()}>{t?.retry || "Retry"}</BaseButton>
        <BaseButton variant="link" onClick={() => router.back()} className="mt-2 text-base text-gray-500">
          {t?.goBack || "← Go Back"}
        </BaseButton>
      </div>
    )
  }

  // ⏳ Loading thực sự (lần đầu hoặc đang loading dữ liệu mới)
  if (isLoading || !product) {
    return <Loading />;
  }

  // Helper function
  function getThumbnailSize(count: number): number {
    if (count <= 3) return 117
    if (count <= 5) return 100
    if (count <= 8) return 70
    return 44
  }

  return (
    <main className="w-full mx-0 lg:flex">
      {/* <div className="flex flex-col lg:flex-row gap-8 items-start"> */}
        {/* Left Column */}
        <div className="w-full lg:w-2/3">
          {/* Image Gallery */}
          <ExpandableImageGallery variant={variant} product={product} images={variant?.image_urls || []} productName={product.name} tags={product?.tags || []}/>

          {/* Expandable Sections */}
          <div className="hidden lg:block mt-[80px] sm:px-[20px]">
            {/* Expandable Sections - Full Width Below Main Content */}
            <div className="max-w-none mx-0 space-y-0 my-16 border-t sm:mt-24">
              {/* Reviews */}
              <div className="border-b px-[30px]">
                <button
                  onClick={() => toggleSection("reviews")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>{t?.reviews || "Reviews"} ({productDetails.reviewCount})</span>
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
                    <Button
                      theme="transparent"
                      border={true}
                      href={`/${slugify(product.name || "product")}/${variant?.variant_code}/submit-review?campaignId=dotcom_pdp`}
                      pressEffect={false}
                      shadow={false}
                      className="bg-transparent hover:bg-gray-100"
                    >
                      {t?.writeAReview || "WRITE A REVIEW"}
                    </Button>
                    <p className="text-gray-600 dark:text-white">{t?.customerReviewsPlaceholder || "Customer reviews and ratings would appear here."}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-b px-[30px]">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>{t?.description || "Description"}</span>
                  {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedSections.description && (
                  <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Cột trái: Text */}
                    <div>
                      <h4 className="text-lg font-extrabold tracking-wide uppercase">
                        {t?.descTitle}
                      </h4>
                      <p className="text-gray-600 dark:text-white leading-relaxed">
                        {t?.descText || productDetails.description}
                      </p>
                    </div>

                    {/* Cột phải: Hình ảnh */}
                    <div className="flex justify-center">
                      <Image
                        src="/assets/product/F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_DM1.jpg"
                        alt="F50 Messi Elite Firm Ground Cleats"
                        width={600}
                        height={600}
                        className="rounded-none object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="border-b px-[30px]">
                <button
                  onClick={() => toggleSection("details")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>{t?.details || "Details"}</span>
                  {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.details && (
                  <div className="pb-6">
                    <ul className="space-y-2">
                      {(
                        [
                          "regularFit",
                          "laceClosure",
                          "hybridTouchUpper",
                          "adidasPrimeknitCollar",
                          "sprintframe360FirmGroundOutsole",
                          "imported",
                          "productColor",
                          "productCode",
                        ] as const
                      ).map((key, i) => (
                        <li key={i} className="text-gray-600 dark:text-white">
                          • {t?.[key] || key}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="border-b px-[30px]">
                <button
                  onClick={() => toggleSection("highlights")}
                  className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
                >
                  <span>{t?.highlights || "Highlights"}</span>
                  {expandedSections.highlights ? <ChevronUp /> : <ChevronDown />}
                </button>
                {expandedSections.highlights && (
                  <div className="pb-6">
                    <ul className="space-y-6">
                      {[
                        { title: t?.accelerateStronger, text: t?.accelerateStrongerText },
                        { title: t?.fitLikeMessi, text: t?.fitLikeMessiText },
                        { title: t?.dribbleFast, text: t?.dribbleFastText },
                        { title: t?.experienceLevel, text: t?.experienceLevelText }
                      ].map((h, i) => (
                        <li key={i}>
                          <h4 className="text-lg font-extrabold tracking-wide">{h.title}</h4>
                          <p className="text-gray-600 dark:text-white">{h.text}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {variant?.variant_code === "JP5593" && (
          <>
          {/* Mid-page Promotional Banner */}
          {/* F50 Messi Prestigio Section */}      
          <div className="hidden mt-[80px] pt-[6px] relative w-full lg:h-[500px] bg-black lg:flex items-center justify-center text-background text-center overflow-hidden">
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t?.f50MessiPrestigio || "F50 MESSI PRESTIGIO"}</h2>
              <p className="text-base sm:text-lgmx-0">
                {t?.f50MessiDescription || "A lightweight boot with a soft touch built to match Leo's fit. Embodying the prestige in the game's dominant icon."}
              </p>
            </div>
          </div>

          <div className="mb-0 sm:mb-[80px]"></div>
          </>
          )}

          {/* Product Carousel */}
          <div className="hidden lg:block sm:mb-[80px]">
          <ProductCarousel products={product.related_products} title={t?.completeTheLook || "COMPLETE THE LOOK"} carouselModeInMobile minimalMobileForProductCard showIndicators={false} />
          <div className="mb-[80px]"></div>
          <ProductCarousel products={product.related_products} title={t?.youMayAlsoLike || "YOU MAY ALSO LIKE"} carouselModeInMobile minimalMobileForProductCard showIndicators />
          <div className="mb-[80px]"></div>
          <HistoryView
            title={
              <>
                {t?.recentlyViewedItems || "RECENTLY VIEWED ITEMS"}
              </>
            }
            showIndicatorsInProductCarousel={false}
          />
          <div id="sticky-stopper" className="h-1 w-full" /> {/* Thêm div giả để quan sát chạm đáy */}
          </div>

        </div>

        {/* Right Column */}
        <aside className="w-full lg:w-1/3">

          <div className="sticky top-4 bg-background p-4 rounded-none border-l px-[20px] sm:px-12">

            {/* Desktop Product Title */}
            <div className="hidden lg:block">
              {/* Gender • Sport + Reviews */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-base text-gray-600 dark:text-white">
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

              <h1 className="text-3xl font-bold mb-4 leading-tight">{upperWords(product.name || "Unknown Product")}</h1>

              <div className="flex items-center space-x-2 mb-6">
                {/* <span className="text-2xl font-bold">${formatPrice(variant?.price)}</span>
                {variant?.compare_at_price && (
                  <span className="text-lg text-gray-500 line-through">${variant?.compare_at_price}</span>
                )} */}
                <ProductPrice
                  price={variant?.price ?? null}
                  compareAtPrice={variant?.compare_at_price ?? null}
                />
              </div>

              <p className="text-base text-black dark:text-white mb-6">{t?.promoCodesNotApply || "Promo codes will not apply to this product."}</p>
            </div>

            <div className="flex lg:hidden mt-[40px]">
                <p className="text-base text-black dark:text-white">{t?.promoCodesNotApply || "Promo codes will not apply to this product."}</p>
            </div>


            {/* Colors */}
            <div className="mt-[40px]">
              {product.variants.length > 1 && (
              <>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">{t?.colors || "Colors"}</h3>
              </div>
              <div
                className="flex gap-2 mt-[10px]"
                onMouseLeave={() => setHoveredColor(variant?.color)} // reset when leave area
              >
                {product.variants.map((variant) => {
                  const isActive = variant.variant_code === params.model
                  const size = getThumbnailSize(product.variants.length)
                  return (
                    <Link
                      key={variant.id}
                      href={`/${slugify(product.name)}/${variant.variant_code}.html`}
                      onMouseEnter={() => setHoveredColor(variant.color)} // only change displayColor when hover 
                      className={cn(
                        `w-[${size}px] h-[${size}px] block overflow-hidden border-b-4`,
                        isActive ? 
                        "border-black dark:border-[#E32B2B]"
                        : "border-transparent hover:border-black dark:hover:border-[#E32B2B]",
                      )}
                    >
                      <Image
                        src={variant?.image_urls?.[0] || "/placeholder.svg"}
                        alt={variant.color}
                        width={size}
                        height={size}
                        className="!w-full !h-full object-cover"
                      />
                    </Link>
                  )
                })}
              </div>
              </>
              )}
              {/* <h3 className="mt-[5px]">{variant?.color}</h3> */}
              <h3 className="mt-[5px]">{displayColor}</h3>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mt-[40px]">
                <h3 className="font-bold text-base">{t?.sizes || "Sizes"}</h3>
                <button className="text-sm underline flex items-center text-black dark:text-white hover:opacity-80">
                  <span className="mr-1">📏</span>
                  {t?.sizeGuide || "Size guide"}
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
                      // disabled={isSoldOut}
                      className={`
                        group relative py-3 text-center text-sm font-medium rounded-none
                        ${isSoldOut
                          ? isSelected
                            ? "bg-[#767677] text-white"
                            : "bg-[#FFFFFF] text-gray-500 hover:bg-[#767677] hover:text-white"
                          : isSelected
                            ? "bg-[#000000] text-white"
                            : "bg-[#ECEFF1] text-black hover:bg-black hover:text-white"}
                      `}
                    >
                      <span className={isSoldOut ? "line-through" : ""}>{size}</span>
                      {isSoldOut && (
                        <span className="absolute top-1 right-0.5 text-xs">
                          {/* 🔔 */}
                          <BellRing className="absolute top-1 right-0.5 w-4 h-4" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="text-red-600 text-sm mt-2 font-medium">{sizeError}</p>
              )}

              <div className="mt-4 p-3 rounded-none bg-background text-sm">
                <div className="flex items-start text-gray-700 dark:text-white leading-snug">
                  <span className="mr-2 mt-[2px] text-background">
                    {/* ℹ️ */}
                    <Info className="text-background w-4 h-4 mr-2" />
                  </span>
                  <span>
                    <strong>{t?.trueToSize || "True to size."}</strong> {t?.trueToSizeText || "We recommend ordering your usual size."}
                  </span>
                </div>
              </div>
            </div>

            {/* Add to Bag & Wishlist - Side by Side */}
            <div className="flex gap-4  mt-6">
              <Button
                border
                theme="black"
                pressEffect
                onClick={handleAddToBag}
                fullWidth
              >
                {t?.addToBag || "ADD TO BAG"}
              </Button>

              <ButtonWish
                shadow={false}
                showArrow={false}
                onClick={handleToggleWishlist}
                className="w-12 h-12 border border-border rounded-none flex items-center justify-center hover:bg-white hover:text-background transition-colors translate-y-[3px]"
              >
                <Heart className={`w-[22px] h-[22px] ${isWishlisted ? "fill-current" : ""}`} />
              </ButtonWish>
            </div>

            {/* Klarna Payment */}
            <div className="flex flex-wrap items-center text-base text-gray-700 dark:text-white mt-6">
              <p className="mr-1">
                From <span className="font-bold">$24.24/month</span>, or 4 payments at 0% interest with
              </p>
              <span className="font-medium">
                <span className="font-bold">Klarna</span>{" "}
                <Link href="#" className="underline">
                  {t?.learnMore || "Learn more"}
                </Link>
              </span>
            </div>

            {/* Gray divider dash */}
            <div className="border-t border-gray-200 my-4" />

            <div className="flex items-center gap-3 text-gray-700 dark:text-white underline ">
              <RefreshCw className="h-5 w-5" />
              <div className="cursor-pointer hover:underline hover:bg-foreground hover:text-background">
                <p className="font-medium">{t?.getDeliveryDates || "Get delivery dates"}</p>
              </div>
            </div>

            {/* Gray divider dash */}
            <div className="border-t border-gray-200 my-4" />

            {/* Features */}
            <div className="flex items-center gap-3 text-gray-700 dark:text-white">
              <Truck className="h-5 w-5" />
              <div>
                <Link href="#" className="underline">
                <p className="text-base">{t?.freeStandardShipping || "Free standard shipping with adiClub"}</p>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700 dark:text-white">
              <CreditCard className="h-5 w-5" />
              <div>
                <Link href="#" className="underline">
                <p className="text-base">{t?.free30DayReturns || "Free 30 day returns"}</p>
                </Link>
              </div>
            </div>

          </div>
        </aside>

        {/* Expandable Sections */}
        <div className="block lg:hidden mt-[80px] sm:px-[20px]">
          {/* Expandable Sections - Full Width Below Main Content */}
          <div className="max-w-none mx-0 space-y-0 my-16 border-t sm:mt-24">
            {/* Reviews */}
            <div className="border-b px-[30px]">
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
                  <Button
                    border
                    theme="transparent"
                    href={`/${slugify(product.name || "product")}/${variant?.variant_code}/submit-review?campaignId=dotcom_pdp`}
                    pressEffect={false}
                    shadow={false}
                    className="bg-transparent border border-black dark:border-white text-black py-3 rounded-none font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {t?.writeAReview || "WRITE A REVIEW"}
                  </Button>
                  <p className="text-gray-600 dark:text-white">{t?.customerReviewsPlaceholder || "Customer reviews and ratings would appear here."}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-b px-[30px]">
              <button
                onClick={() => toggleSection("description")}
                className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
              >
                <span>{t?.description || "Description"}</span>
                {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedSections.description && (
                <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Cột trái: Text */}
                  <div>
                    <h4 className="text-lg font-extrabold tracking-wide uppercase">
                      {t?.descTitle}
                    </h4>
                    <p className="text-gray-600 dark:text-white leading-relaxed">
                      {t?.descText || productDetails.description}
                    </p>
                  </div>

                  {/* Cột phải: Hình ảnh */}
                  <div className="flex justify-center">
                    <Image
                      src="/assets/product/F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_DM1.jpg"
                      alt="F50 Messi Elite Firm Ground Cleats"
                      width={600}
                      height={600}
                      className="rounded-none object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="border-b px-[30px]">
              <button
                onClick={() => toggleSection("details")}
                className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
              >
                <span>{t?.details || "Details"}</span>
                {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSections.details && (
                <div className="pb-6">
                  <ul className="space-y-2">
                    {(
                      [
                        "regularFit",
                        "laceClosure",
                        "hybridTouchUpper",
                        "adidasPrimeknitCollar",
                        "sprintframe360FirmGroundOutsole",
                        "imported",
                        "productColor",
                        "productCode",
                      ] as const
                    ).map((key, i) => (
                      <li key={i} className="text-gray-600 dark:text-white">
                        • {t?.[key] || key}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Highlights */}
            <div className="border-b px-[30px]">
              <button
                onClick={() => toggleSection("highlights")}
                className="w-full flex justify-between items-center py-6 text-left font-bold text-lg"
              >
                <span>{t?.highlights || "Highlights"}</span>
                {expandedSections.highlights ? <ChevronUp /> : <ChevronDown />}
              </button>
              {expandedSections.highlights && (
                <div className="pb-6">
                  <ul className="space-y-6">
                    {[
                      { title: t?.accelerateStronger, text: t?.accelerateStrongerText },
                      { title: t?.fitLikeMessi, text: t?.fitLikeMessiText },
                      { title: t?.dribbleFast, text: t?.dribbleFastText },
                      { title: t?.experienceLevel, text: t?.experienceLevelText }
                    ].map((h, i) => (
                      <li key={i}>
                        <h4 className="text-lg font-extrabold tracking-wide">{h.title}</h4>
                        <p className="text-gray-600 dark:text-white">{h.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {variant?.variant_code === "JP5593" && (
        <>
        {/* Mid-page Promotional Banner */}
        {/* F50 Messi Prestigio Section */}
        <div className="flex lg:hidden mt-[80px] pt-[6px] relative w-full h-[582px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-background text-center overflow-hidden">
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
        <div className="flex lg:hidden relative w-full h-[402px] sm:h-[400px] md:h-[500px] bg-black sm:flex items-center justify-center text-white text-center overflow-hidden">
          <Image
            src="/assets/product/football_fw25_messi_statement_launch_m_74db237251.jpg?height=1004&width=750"
            alt="F50 Messi Prestigio"
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            className="z-0"
            sizes="100vw"
          />
          <div className="z-10 p-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t?.f50MessiPrestigio || "F50 MESSI PRESTIGIO"}</h2>
            <p className="text-base sm:text-lgmx-0">
              {t?.f50MessiDescription || "A lightweight boot with a soft touch built to match Leo's fit. Embodying the prestige in the game's dominant icon."}
            </p>
          </div>
        </div>

        <div className="block lg:hidden mb-[80px]"></div>
        </>
        )}

        {/* Product Carousel */}
        <div className="block lg:hidden lg:block mb-[60px]">
        <ProductCarousel products={product.related_products} title={t?.completeTheLook || "COMPLETE THE LOOK"} carouselModeInMobile showIndicators={false} />
        <div className="mb-[60px]"></div>
        <ProductCarousel products={product.related_products} title={t?.youMayAlsoLike || "YOU MAY ALSO LIKE"} carouselModeInMobile showIndicators />
        <div className="mb-[60px]"></div>
        <HistoryView
          title={
            <>
              {t?.recentlyViewedItems || "RECENTLY VIEWED ITEMS"}
            </>
          }
          showIndicatorsInProductCarousel={false}
        />
        <div id="sticky-stopper" className="h-1 w-full" /> {/* Thêm div giả để quan sát chạm đáy */}
        </div>
      {/* </div> */}
    </main>
  )
}
