// ProductDetailPageClient.tsx (full version with fixed state and API bindings)
"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addToCart } from "@/store/cartSlice"
import { toggleWishlist } from "@/store/wishlistSlice"
import { Button } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronDown, ChevronUp, Heart, ArrowLeft } from "lucide-react"
import ExpandableImageGallery from "@/components/expandable-image-gallery"
import Loading from "@/components/loading"
import HistoryView from "@/components/HistoryView"
// import { useProductDetail } from "@/api/hooks/useProductDetail"
import { Product, Variant } from "@/types/product"
import { soccerShoesData } from "@/data/soccer-shoes-data"
import { slugify } from "@/utils/slugtify"
import { useRouter } from "next/navigation"
import ProductCarousel from "@/components/product-carousel"
import { useProductDetail } from "@/api/hooks/useProducts"


type Props = {
  params: {
    slug: string
    model: string
  }
}

export default function ProductDetailPageClient({ params }: Props) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const [selectedSize, setSelectedSize] = useState("")
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    reviews: false,
    description: false,
    details: false,
  })
  const [sizeError, setSizeError] = useState("")
  const [isSticky, setIsSticky] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentVariant, setCurrentVariant] = useState<any>(null)

  const { data: product, isLoading, isError, error, refetch } = useProductDetail(params.slug, params.model)

  useEffect(() => {
    if (!product) return
    setIsWishlisted(wishlistItems.some((item) => Number(item.id) === Number(product.id)))
    setCurrentVariant(product.variants[selectedVariant])
  }, [product, selectedVariant, wishlistItems])

  const variant = useMemo<Variant | undefined>(() => {
    return product?.variants.find((v) => v.variant_code === params.model)
  }, [product, params.model])

  const sizes = useMemo(() => {
    return variant?.sizes ?? []
  }, [variant])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return

      const scrollTop = window.scrollY
      const leftColumn = document.getElementById("left-column")
      const rightColumn = document.getElementById("right-column")
      const footer = document.querySelector("footer")

      if (leftColumn && rightColumn && footer) {
        const leftColumnBottom = leftColumn.offsetTop + leftColumn.offsetHeight
        const stopSticky = leftColumnBottom - rightColumn.offsetHeight - 100
        setIsSticky(scrollTop > 200 && scrollTop < stopSticky)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError("Please select your size")
      return
    }
    setSizeError("")
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
    setExpandedSections((prev) => {
      const newSections = {
        reviews: false,
        description: false,
        details: false,
      }
      newSections[section] = !prev[section]
      return newSections
    })
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setSizeError("")
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Loading />
      </div>
    )
  }

  const relatedProducts = soccerShoesData.filter((p) => p.id !== product.id).slice(0, 4)
  const youMayAlsoLike = soccerShoesData
    .filter((p) => p.id !== product.id && p.collection !== product.collection)
    .slice(0, 4)

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

  const fallbackUrl = `/${slugify(product.name)}/${product?.variants?.[0]?.variant_code}.html`
  
    // return (
    //   <Link href={product.url ?? fallbackUrl}></Link>

  // return (
  //   <main className="container mx-auto px-4 py-4 lg:py-8">
  //     <div className="lg:flex lg:gap-0 lg:items-start">
  //       {/* Left */}
  //       <div id="left-column" className="lg:w-[60%] lg:pr-8 lg:border-r border-gray-200">
  //         <ExpandableImageGallery
  //           images={variant.image_urls}
  //           productName={product.name}
  //         />
  //       </div>

  //       {/* Right */}
  //       <div id="right-column" className="lg:w-[40%] lg:pl-8">
  //         <div
  //           className={`lg:transition-all lg:duration-300 ${
  //             isSticky ? "lg:fixed lg:top-4 lg:w-[calc(40%-4rem)]" : "lg:static"
  //           }`}
  //         >
  //           <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
  //           <p className="text-xl font-bold mb-4">${product.price}</p>

  //           {/* Variants */}
  //           <div className="mb-4">
  //             <h3 className="font-bold mb-2">Color: {currentVariant?.color}</h3>
  //             <div className="flex gap-2">
  //               {product.variants.map((variant, index) => (
  //                 <button
  //                   key={variant.id}
  //                   onClick={() => setSelectedVariant(index)}
  //                   className={`w-12 h-12 border-2 overflow-hidden ${
  //                     selectedVariant === index ? "border-border" : "border-gray-300"
  //                   }`}
  //                 >
  //                   <img src={variant.avatar_url} alt={variant.color} className="w-full h-full object-cover" />
  //                 </button>
  //               ))}
  //             </div>
  //           </div>

  //           {/* Sizes */}
  //           <div className="mb-4">
  //             <h3 className="font-bold mb-2">Sizes</h3>
  //             <div className="grid grid-cols-5 gap-2">
  //               {sizes.map((size) => (
  //                 <button
  //                   key={size}
  //                   onClick={() => handleSizeSelect(size)}
  //                   className={`py-2 border text-base ${
  //                     selectedSize === size ? "bg-black text-white" : "hover:border-border"
  //                   }`}
  //                 >
  //                   {size}
  //                 </button>
  //               ))}
  //             </div>
  //             {sizeError && <p className="text-red-600 text-base mt-2">{sizeError}</p>}
  //           </div>

  //           {/* Buttons */}
  //           <div className="flex gap-4 mb-6">
  //             <Button onClick={handleAddToBag} fullWidth>
  //               ADD TO BAG
  //             </Button>
  //             <button onClick={handleToggleWishlist} className="w-12 h-12 border border-border">
  //               <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
  //             </button>
  //           </div>

  //           {/* Features */}
  //           {/* <div className="space-y-2">
  //             {product.features.map((feature, i) => (
  //               <p key={i} className="text-base text-gray-600 dark:text-white">📦 {feature}</p>
  //             ))}
  //           </div> */}
  //         </div>
  //       </div>
  //     </div>

  //     {/* Accordion */}
  //     <div className="my-12 border-t">
  //       <div className="border-b">
  //         <button onClick={() => toggleSection("description")} className="py-4 w-full flex justify-between">
  //           <span>Description</span>
  //           {expandedSections.description ? <ChevronUp /> : <ChevronDown />}
  //         </button>
  //         {expandedSections.description && <p className="pb-4 text-gray-600 dark:text-white">{product.description}</p>}
  //       </div>

  //       <div className="border-b">
  //         <button onClick={() => toggleSection("details")} className="py-4 w-full flex justify-between">
  //           <span>Details</span>
  //           {expandedSections.details ? <ChevronUp /> : <ChevronDown />}
  //         </button>
  //         {expandedSections.details && (
  //           <ul className="pb-4 text-gray-600 dark:text-white space-y-2">
  //             {product.description}
  //             <li>• Product code: {product.jan_code}</li>
  //             <li>• Color: {currentVariant?.color}</li>
  //           </ul>
  //         )}
  //       </div>

  //       <div className="border-b">
  //         <button onClick={() => toggleSection("reviews")} className="py-4 w-full flex justify-between">
  //           <span>Reviews ({product.review_count})</span>
  //           {expandedSections.reviews ? <ChevronUp /> : <ChevronDown />}
  //         </button>
  //         {expandedSections.reviews && (
  //           <div className="pb-4">
  //             <p className="font-bold text-lg">Rating: {product.rating}/5</p>
  //             <div className="flex mb-2">
  //               {[...Array(5)].map((_, i) => (
  //                 <Star
  //                   key={i}
  //                   size={16}
  //                   className={i < Math.floor(product.rating) ? "fill-green-500 text-green-500" : "text-gray-300"}
  //                 />
  //               ))}
  //             </div>
  //             <p className="text-gray-600 dark:text-white">Customer reviews coming soon.</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* History */}
  //     <HistoryView title="RECENTLY VIEWED ITEMS" showIndicatorsInProductCarousel={false} />
  //   </main>
  // )
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container mx-auto px-4 py-4 lg:py-8">
        {/* Mobile Breadcrumb */}
        <nav className="lg:hidden text-base text-gray-600 dark:text-white mb-4 flex items-center">
          <Link href="/women-shoes" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>{productDetails.breadcrumb}</span>
          </Link>
        </nav>

        {/* Desktop Layout - 60:40 Split with Gray Divider */}
        <div className="lg:flex lg:gap-0 lg:items-start">
          {/* Left Column - 60% Width - Images with Overlay Elements */}
          <div id="left-column" className="relative mb-8 lg:mb-0 lg:w-[60%] lg:pr-8 lg:border-r lg:border-gray-200">
            {/* Desktop Breadcrumb - Overlay on Image */}
            <nav className="hidden lg:block absolute top-4 left-4 z-20 text-base text-gray-700 bg-background/80 backdrop-blur-xs px-3 py-1 rounded-none">
              <Link href="/men-soccer-shoes" className="hover:underline">
                {productDetails.breadcrumb}
              </Link>
            </nav>

            {/* Best Seller Badge - Gray Background, Black Text, Counter-clockwise */}
            {product.badge === "Best seller" && (
              <div className="absolute top-4 right-1 z-20 lg:top-8 lg:right-1">
                <div className="bg-gray-300 text-background text-xs font-bold px-2 py-1 lg:px-3 lg:py-2 lg:transform lg:-rotate-90 lg:origin-center rounded-none">
                  BEST SELLER
                </div>
              </div>
            )}

            <ExpandableImageGallery images={variant?.image_urls || [
              "/placeholder.svg", 
              "/placeholder.svg",
              "/placeholder.svg",
              "/placeholder.svg"
            ]} productName={product.name} />
          </div>

          {/* Right Column - 40% Width - Product Info with Enhanced Sticky */}
          <div id="right-column" className="lg:w-[40%] lg:pl-8 lg:relative">
            <div
              className={`lg:transition-all lg:duration-300 ${
                isSticky ? "lg:fixed lg:top-4 lg:w-[calc(40%-4rem)] lg:bg-background lg:z-10 lg:pr-4" : "lg:static lg:w-full"
              }`}
              style={{
                right: isSticky ? `max(1rem, calc(50vw - 640px + 1rem))` : "auto",
              }}
            >
              <div className="space-y-6 lg:max-w-lg">
                {/* Mobile Product Title */}
                <div className="lg:hidden">
                  <h1 className="text-xl font-bold mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.badge === "Best seller" && (
                      <Badge className="bg-gray-300 text-background text-xs rounded-none">BEST SELLER</Badge>
                    )}
                  </div>
                </div>

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

                  <h1 className="text-3xl font-bold mb-4 leading-tight">{product.name}</h1>

                  <div className="flex items-center space-x-2 mb-6">
                    <span className="text-2xl font-bold">${variant?.price}</span>
                    {variant?.compare_at_price && (
                      <span className="text-lg text-gray-500 line-through">${variant?.compare_at_price}</span>
                    )}
                  </div>

                  <p className="text-base text-gray-600 dark:text-white mb-6">Promo codes will not apply to this product.</p>
                </div>


                {/* Colors */}
                <div>
                  <h3 className="mb-3">{variant?.color}</h3>
                  <div className="flex gap-2">
                    {product.variants.map((v) => {
                      const isActive = v.variant_code === params.model
                      return (
                        <Link
                          key={v.id}
                          href={`/${slugify(product.name)}/${v.variant_code}.html`}
                          className={`
                            w-12 h-12 overflow-hidden block
                            border-b-4
                            ${isActive ? "border-border" : "border-transparent hover:border-border"}
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
                    <button className="text-base underline flex items-center">
                      <span className="mr-1">📏</span>
                      Size guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {sizes.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        onClick={() => handleSizeSelect(size)}
                        className={`py-3 border text-center font-medium text-base rounded-none ${
                          selectedSize === size
                            ? "border-border bg-black text-white"
                            : "border-gray-300 hover:border-border"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {sizeError && <p className="text-red-600 text-base mt-2 font-medium">{sizeError}</p>}
                  <div className="mt-3 p-3 border border-gray-300 rounded-none">
                    <div className="flex items-center text-base text-gray-600 dark:text-white">
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
                    className="w-12 h-12 border border-border rounded-none flex items-center justify-center hover:bg-background hover:text-background transition-colors translate-y-[3px]"
                  >
                    <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                  </button>
                </div>

                <div className="text-center text-base text-gray-600 dark:text-white">
                  <p>From $24.24/month, or 4 payments at 0% interest with</p>
                  <button className="underline font-medium">Klarna Learn more</button>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  {productDetails.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-base">
                      <span className="text-blue-600">📦</span>
                      <span className="underline">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Sections - Full Width Below Main Content */}
        <div className="max-w-none mx-auto space-y-0 my-16 border-t lg:mt-24">
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
                <Button className="mb-4 border-border text-background bg-transparent hover:bg-background hover:text-gray-500 rounded-none">
                  WRITE A REVIEW
                </Button>
                <p className="text-gray-600 dark:text-white">Customer reviews and ratings would appear here.</p>
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
                <p className="text-gray-600 dark:text-white leading-relaxed">{productDetails.description}</p>
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
                    <li key={index} className="text-gray-600 dark:text-white">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                LIGHTWEIGHT F50 CLEATS FOR SHOWING NON-STOP MESSI SKILLS ON FIRM GROUND
              </h2>
              <p className="text-gray-600 dark:text-white mb-6">
                Engineered for speed, these F50 Laceless Boots feature a lightweight Fiberskin upper and Sprintframe
                outsole for explosive acceleration. The laceless construction provides a clean ball contact surface,
                while Messi signature details celebrate the GOAT.
              </p>
            </div>
            <div className="aspect-square bg-background rounded-lg overflow-hidden">
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

        {/* Complete The Look */}
        <div className="mt-16">
          {/* <h2 className="text-2xl font-bold mb-4">COMPLETE THE LOOK</h2> */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Card key={item.id} className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-base mb-2">{item.name}</h3>
                  <p className="font-bold">${item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div> */}
          {/* <HistoryViewrelated_products
                  title={
                    <>
                      COMPLETE THE LOOK
                    </>
                  }
                /> */}

          <ProductCarousel
                    products={product?.related_products}
                    title={"COMPLETE THE LOOK"}
                    carouselModeInMobile={true}
                    // viewMoreHref={viewMoreHref}
                    minimalMobileForProductCard={true}
                  />
        </div>

        {/* You May Also Like */}
        <div className="mt-16">
          {/* <h2 className="text-2xl font-bold mb-4">YOU MAY ALSO LIKE</h2> */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {youMayAlsoLike.map((item) => (
              <Card key={item.id} className="border-none shadow-none">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-base mb-2">{item.name}</h3>
                  <p className="font-bold">${item.price}</p>
                </CardContent>
              </Card>
            ))}
          </div> */}
          {/* <HistoryView
                  title={
                    <>
                      YOU MAY ALSO LIKE
                    </>
                  }
                /> */}
          <ProductCarousel
                    products={product?.related_products}
                    title={"YOU MAY ALSO LIKE"}
                    carouselModeInMobile={true}
                    // viewMoreHref={viewMoreHref}
                    minimalMobileForProductCard={true}
                  />
        </div>

        {/* Recently Viewed Items */}
        <HistoryView
          title={
            <>
              RECENTLY VIEWED ITEMS
            </>
          }
          showIndicatorsInProductCarousel={false}
        />
      </main>
      
    </div>
  )
}
