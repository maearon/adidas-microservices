"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, X, ChevronDown } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { removeFromCart, updateQuantity } from "@/store/cartSlice"
import { addToWishlist } from "@/store/wishlistSlice"
// import { useSelector } from "react-redux"
// import { selectUser } from "@/store/sessionSlice"
import { capitalizeTitle } from "@/utils/sanitizeMenuTitleOnly"
import Link from "next/link"
import { BaseButton } from "@/components/ui/base-button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
// import { authClient } from "@/lib/auth-client"
import { Session } from "@/lib/auth"
import Image from "next/image"
import ProductCarousel from "@/components/product-carousel"
import { Product } from "@/types/product"
import { useTranslations } from "@/hooks/useTranslations"
import { newArrivalProducts as newArrivalProductsTab } from "@/data/fake-new-arrival-products"
import { CartItem } from "@/types/cart"
import ProductPrice from "@/components/ProductCardPrice"
import { useTheme } from "next-themes"

interface CartPageClientProps {
  session: Session | null;
}

export default function CartPageClient({ session }: CartPageClientProps) {
  const t = useTranslations("categoryPages")
  const [showPromoCode, setShowPromoCode] = useState(false)
  // const { value: current_user, status } = useSelector(selectUser)
  // const { data: session } = authClient.getSession()
  const current_user = session?.user
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector((state) => state.cart.items)
  const { 
      // theme, 
      resolvedTheme 
    } = useTheme()
    const [mounted, setMounted] = useState(false)

  // Function to remove item from cart
  const handleRemoveItem = (id: number) => {
    dispatch(removeFromCart(id))
  }

  // Function to move item to wishlist
  const handleMoveToWishlist = (item: CartItem) => {
    // Add to wishlist
    dispatch(
      addToWishlist({
        id: item.id,
        name: item.name,
        price: String(item?.price),
        image: item.image,
        category: item.category,
      }),
    )
    // Remove from cart
    dispatch(removeFromCart(item.id))
  }

  // Function to update item quantity
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    dispatch(updateQuantity({ id, quantity: newQuantity }))
  }

  const handleNext = () => {
    // Placeholder for promo code application logic
    alert("Promo code applied!")
  }

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.compareAtPrice) || Number(item.price) || 0) * item.quantity,
    0
  )
  const saleAmount = originalTotal - subtotal
  const salesTax = subtotal * 0.12
  const total = subtotal + salesTax
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="grow container mx-auto px-2 py-28">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-10">YOUR BAG IS EMPTY</h1>
            <p className="text-gray-600 dark:text-white mb-6">
              Once you add something to your bag, it will appear here. Ready to get started?
            </p>
            <div className="max-w-[180px] w-full">
            <Button
              border
              theme="black"
              showArrow
              pressEffect
              shadow
              href="/"
              className="w-full py-3 font-semibold transition-colors"
            >
              GET STARTED
            </Button>
            </div>
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    )
  }

  const topPicks = [
    { id: 1, name: "Samba OG Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
    { id: 2, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
    { id: 3, name: "Ultraboost 1.0 Shoes", price: "$190", image: "/placeholder.png?height=300&width=250" },
    { id: 4, name: "Gazelle Indoor Shoes", price: "$100", image: "/placeholder.png?height=300&width=250" },
  ]

  const isDark = resolvedTheme === "dark"

  // Cart with items view
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="grow max-w-6xl mx-auto px-2 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-[#ECEFF1] dark:bg-white text-black p-4 mb-6">
                <h2 className="font-bold">HI, {capitalizeTitle(current_user?.name || "USER")}!</h2>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <h1 className="text-2xl font-bold tracking-tight">YOUR BAG</h1>
                <span className="text-gray-600 dark:text-white text-sm font-normal">
                  [{totalItems} items]
                </span>
              </div>

              <p className="text-base text-gray-500 mb-6">
                Items in your bag are not reserved — check out now to make them yours.
              </p>

              {/* Cart items */}
              {cartItems.map((item) => (
                <Card key={item.id} className="mb-4 border rounded-none">
                  <div className="flex p-4">
                    <div className="w-1/4 pr-4">
                      <img src={item.image || "/placeholder.png"} alt={item.name} className="w-full h-auto" />
                    </div>
                    <div className="w-3/4 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="py-[20px]">
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-base text-gray-600 dark:text-white">{item.color}</p>
                          <p className="text-base text-gray-600 dark:text-white">SIZE: {item.size}</p>
                          {/* Image /assets/payment/prime-delivery.svg 60,16 x 19 */}
                          <div className="flex items-center gap-2 mt-[10px]">
                            <Image
                              src="/assets/payment/prime-delivery.svg"
                              alt="Prime Delivery"
                              width={60}
                              height={16}
                              className="object-contain"
                            />
                            {/* <p className="text-sm text-gray-600 dark:text-white">Fast, free delivery with Prime</p> */}
                          </div>
                          {item.customization && (
                            <>
                              <p className="text-base text-gray-600 dark:text-white">NAME: {item.customization.name}</p>
                              <p className="text-base text-gray-600 dark:text-white">NUMBER: {item.customization.number}</p>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {<ProductPrice price={item?.price * item.quantity} compareAtPrice={item?.compareAtPrice ? item?.compareAtPrice * item.quantity : null} />}
                          </p>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-background">
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="relative">
                          <select
                            value={item.quantity}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              handleUpdateQuantity(item.id, Number.parseInt(e.target.value))
                            }
                            className="appearance-none
                            border border-black dark:border-white 
                            focus:border-black dark:focus:border-white py-2 pl-4 pr-10 
                            rounded-none outline-none"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={16}
                            className="absolute right-3 top-3 pointer-events-none"
                          />
                        </div>
                        <button className="text-gray-600 dark:text-white hover:text-background" onClick={() => handleMoveToWishlist(item as CartItem)}>
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Top Picks */}
              <section className="container">
                <h2 className="text-xl font-bold mb-4">{t?.topPicks || "TOP PICKS FOR YOU"}</h2>
        
                <ProductCarousel
                  products={newArrivalProductsTab.map(p => p.product) as Product[]}
                />
              </section>

              {/* Custom design notice */}
              {/* <div className="bg-white dark:bg-black text-black dark:text-white p-4 mb-6 text-base">
                <p>
                  We start working on your custom design right away. As a result, no changes can be made after order is
                  placed. Customized products can only be returned in case of manufacturing defects.
                </p>
              </div> */}

              {/* Payment options */}
              <div className="mt-12 border-t pt-6">
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-base">Pay over time in interest-free installments with Affirm, Klarna or Afterpay</p>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-base">Free shipping with adiClub</p>
                </div>
              </div>
            </div>

            {/* Right column - Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {/* <h2 className="text-lg font-bold mb-4">ORDER SUMMARY</h2> */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">ORDER SUMMARY</h2>
                  {/* <BaseButton variant="link" className="text-base font-bold underline">
                    EDIT
                  </BaseButton> */}
                </div>
                {/* <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>{totalItems} Items</span>
                    <span>{<ProductPrice price={subtotal} compareAtPrice={null} />}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sales Tax</span>
                    <span>{<ProductPrice price={salesTax} compareAtPrice={null} />}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold border-t border-b py-4 mb-4">
                  <span>Total</span>
                  <span>{<ProductPrice price={total} compareAtPrice={null} />}</span>
                </div> */}

                {/* Klarna Payment */}
                {/* <div className="flex flex-wrap items-center text-base text-gray-700 dark:text-white mt-6">
                  <p className="mr-1">
                    From <span className="font-bold">{<ProductPrice price={24.24} compareAtPrice={null} />}/month</span>, or 4 payments at 0% interest with
                  </p>
                  <span className="font-medium">
                    <span className="font-bold">Klarna</span>{" "}
                    <Link href="#" className="underline">
                      Learn more
                    </Link>
                  </span>
                </div> */}
                {/* <p className="text-xs text-gray-600 dark:text-white">
                  From $31.57/month or 4 payments at 0% interest with <strong>Klarna</strong>
                </p> */}

                {/* Order Summary */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-base">
                    <span>{totalItems} items</span>
                    <span><ProductPrice price={subtotal} compareAtPrice={null} /></span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Original price</span>
                    <span><ProductPrice price={originalTotal} compareAtPrice={null} /></span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Sales Tax</span>
                    <span><ProductPrice price={salesTax} compareAtPrice={null} /></span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span>Sale</span>
                    <span className="text-red-600">-<ProductPrice price={saleAmount} compareAtPrice={null} /></span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span><ProductPrice price={total} compareAtPrice={null} /></span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-white">
                    From $31.57/month or 4 payments at 0% interest with <strong>Klarna</strong>
                  </p>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <BaseButton
                    variant="outline"
                    onClick={() => setShowPromoCode(!showPromoCode)}
                    className="w-full justify-start"
                  >
                    {/*  <Tag className="mr-2 h-4 w-4" />  */}
                    <Image
                      src="/assets/payment/promo-code.svg"
                      alt="Promo Code"
                      width={24}
                      height={14}
                      className="object-contain mr-2 dark:invert"
                    />
                    USE A PROMO CODE
                  </BaseButton>
                  {showPromoCode && (
                    <div className="mt-2 flex">
                      <Input placeholder="Enter your promo code" className="rounded-r-none" />
                      {/*  <Button className="rounded-l-none bg-black text-white">APPLY</Button>  */}
                      <Button
                        pressEffect={true}
                        onClick={handleNext}
                        fullWidth={false}
                        border
                        shadowColorModeInWhiteTheme="black"
                        theme={isDark ? "white" : "black"}
                      >
                        APPLY
                        {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Checkout buttons */}
                <Button border href="/checkout" theme="black" shadow={true} pressEffect={true}>
                  CHECKOUT
                </Button>

                {/* Accepted Payment Methods */}
                <AcceptedPaymentMethods />

              </div>
            </div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export function AcceptedPaymentMethods() {
  return (
    <div className="mt-10">
      <h3 className="text-sm font-bold uppercase mb-2">Accepted payment methods</h3>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {[
          { src: "/assets/payment/download.svg", alt: "AmEx" },
          { src: "/assets/payment/download (1).svg", alt: "Discover" },
          { src: "/assets/payment/download (2).svg", alt: "Mastercard" },
          { src: "/assets/payment/download (3).svg", alt: "Visa" },
          { src: "/assets/payment/download (7).svg", alt: "Klarna" },
          { src: "/assets/payment/download (8).svg", alt: "Google Pay" },
          // { break: true },
          { src: "/assets/payment/download (9).svg", alt: "ADIDAS" },
          { src: "/assets/payment/download (10).svg", alt: "Shop Pay" },
          { src: "/assets/payment/download (11).svg", alt: "PayPal" },
          { src: "/assets/payment/download (12).svg", alt: "Afterpay" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center w-[46px] h-[28px] bg-white dark:bg-black border border-transparent"
          >
            <Image
              src={item.src ?? "/placeholder.png?height=30&width=42"}
              alt={item.alt ?? "Payment Method"}
              width={42}
              height={30}
              className="object-contain max-h-[18px] dark:invert transition duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
