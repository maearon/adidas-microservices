"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks" // ✅ dùng hook đúng
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { BaseButton } from "@/components/ui/base-button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ArrowRight, Tag } from "lucide-react"
// import { useSelector } from "react-redux"
// import { selectUser } from "@/store/sessionSlice"
// import { CartItem } from "@/types/cart"
import { User } from "@/types/user"
// import javaService from "@/api/services/javaService"
import FullScreenLoader from "@/components/ui/FullScreenLoader"
import { formatPrice } from "@/lib/utils"
// import type { Session } from "@/lib/auth"
import ProductPrice from "@/components/ProductCardPrice"
import { authClient } from "@/lib/auth-client";
// import { AcceptedPaymentMethods } from "@/app/(main)/cart/CartPageClient"
import Image from "next/image"
import { useTheme } from "next-themes"
import orderService, { getCustomerIdFromSession } from "@/api/services/orderService"
import { clearCart } from "@/store/cartSlice"
import { useRouter } from "next/navigation"
import PaymentMethods, { PaymentMethod } from "@/components/checkout/PaymentMethods"

// type CheckoutPageProps = {
//   session: Session | null
// }

export default function CheckoutPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { 
      data: session, 
      isPending, //loading state
      error, //error object
      refetch //refetch the session
  } = authClient.useSession()
  // const cartItems = useAppSelector((state) => state.cart.items)
  // const [cartItemsRails, setCartItemsRails] = useState([] as CartItem[])
  const cartItems = useAppSelector((state) => state.cart.items) // ✅ lấy cart từ redux
  const [users, setUsers] = useState([] as User[])
  const [page, setPage] = useState(1)
  const [total_count, setTotalCount] = useState(1)
  // const { value: user, status } = useSelector(selectUser)
  const userLoading = isPending
  const [hasMounted, setHasMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    saveInfo: false,
    sameAddress: true,
    ageVerified: true,
  })
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  })
  const [showPromoCode, setShowPromoCode] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const { 
    // theme, 
    resolvedTheme 
  } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({
        ...prev,
        email: session.user.email
      }))
    }
  }, [session])
  
  useEffect(() => {
    // javaService.getCart(page)
    //   .then(response => {
    //     setCartItemsRails(response.data)
    //     setTotalCount(response.data.length || 1)
    //   })
    //   .catch(console.error)
  }, [page])

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  )

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.compareAtPrice) || Number(item.price) || 0) * item.quantity,
    0
  )

  const saleAmount = originalTotal - subtotal
  const salesTax = subtotal * 0.12
  const delivery = 0 // Free delivery
  const total = subtotal + salesTax + delivery
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: !formData.firstName ? "Please enter your first name." : "",
      lastName: !formData.lastName ? "Please enter your last name." : "",
      address: !formData.address ? "Please enter your delivery address." : "",
      phone: !formData.phone ? "Please enter your telephone number." : "",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleNext = async () => {
    if (!validateForm()) {
      return
    }

    // Validate cart
    if (!cartItems || cartItems.length === 0) {
      setOrderError("Your cart is empty. Please add items before checkout.")
      return
    }

    // Validate payment method
    if (!selectedPaymentMethod) {
      setOrderError("Please select a payment method.")
      return
    }

    setIsSubmitting(true)
    setOrderError(null)

    try {
      // Lấy customerId từ session
      const customerId = getCustomerIdFromSession(session?.user)

      // Gọi API tạo order trước
      const orderResponse = await orderService.createOrder(cartItems, customerId)

      if (!orderResponse || !orderResponse.orderId) {
        throw new Error("Failed to create order")
      }

      // Nếu COD, không cần tạo payment intent
      if (selectedPaymentMethod === "cod") {
        dispatch(clearCart())
        router.push(`/order-confirmation?orderId=${orderResponse.orderId}&payment=cod`)
        return
      }

      // Tạo payment intent
      const paymentResponse = await fetch("/api/v1/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderId: orderResponse.orderId,
          amount: total,
          currency: "USD",
          paymentMethod: selectedPaymentMethod,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Failed to create payment intent")
      }

      const paymentData = await paymentResponse.json()

      // Handle different payment methods
      if (paymentData.payUrl) {
        // MoMo hoặc VNPay - redirect to payment gateway
        window.location.href = paymentData.payUrl
      } else if (paymentData.clientSecret) {
        // Stripe - redirect to Stripe checkout hoặc handle client-side
        // For now, redirect to confirmation (will implement Stripe Elements later)
        dispatch(clearCart())
        router.push(`/order-confirmation?orderId=${orderResponse.orderId}&payment=${selectedPaymentMethod}`)
      } else {
        // PayPal or other - redirect to confirmation
        dispatch(clearCart())
        router.push(`/order-confirmation?orderId=${orderResponse.orderId}&payment=${selectedPaymentMethod}`)
      }
    } catch (error: unknown) {
      console.error("Error processing order:", error)
      setOrderError(
        error instanceof Error 
          ? error.message 
          : "Failed to process order. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasMounted || userLoading) return <FullScreenLoader />

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">CHECKOUT</h1>
        <p className="text-gray-600 dark:text-white">
          ({totalItems} items) <ProductPrice price={total} compareAtPrice={null} />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left Column - Checkout Form */}
        <div className="space-y-8">
          {/* Contact Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">CONTACT</h2>
            <p className="text-base text-gray-600 dark:text-white">{session?.user?.email || "guest@gmail.com"}</p>
          </div>

          {/* Address Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">ADDRESS</h2>
            <h3 className="font-medium mb-4">Delivery address</h3>

            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-base mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Input
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-base mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Address Field */}
              <div className="relative">
                <Input
                  placeholder="Find delivery address *"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                {errors.address && <p className="text-red-500 text-base mt-1">{errors.address}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <Input
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-base mt-1">{errors.phone}</p>}
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveInfo: !!checked }))}
                  />
                  <label htmlFor="saveInfo" className="text-base">
                    Save address and contact information for future orders
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sameAddress"
                    checked={formData.sameAddress}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, sameAddress: !!checked }))}
                  />
                  <label htmlFor="sameAddress" className="text-base font-medium">
                    Billing and delivery address are the same
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ageVerified"
                    checked={formData.ageVerified}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ageVerified: !!checked }))}
                  />
                  <label htmlFor="ageVerified" className="text-base font-medium">
                    I&apos;m 13+ years old. *
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {orderError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
                  {orderError}
                </div>
              )}

              {/* Next Button */}
              <div className="max-w-[50%]">
                <Button
                  pressEffect={true}
                  onClick={handleNext}
                  fullWidth={true}
                  border
                  shadowColorModeInWhiteTheme="black"
                  theme={isDark ? "white" : "black"}
                  disabled={isSubmitting || cartItems.length === 0}
                >
                  {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                  {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                </Button>
              </div>
            </div>
          </div>

          {/* Shipping Section */}
          <div>
            <h2 className="text-lg font-bold mb-4 text-gray-400">SHIPPING</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Standard delivery - Free
            </p>
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">PAYMENT</h2>
            <PaymentMethods
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
              country={formData.address ? "US" : "VN"} // Detect from address or default
            />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <div className="sticky top-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">YOUR ORDER</h2>
              <BaseButton variant="link" className="text-base font-bold underline">
                EDIT
              </BaseButton>
            </div>

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

            {/* Order Items */}
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="border rounded-none">
                  <CardContent className="flex p-4">
                    <div className="w-20 h-20 mr-4">
                      <img
                        src={item?.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{item.name}</h3>
                      <p className="text-base font-bold"><ProductPrice price={item?.price} compareAtPrice={item?.compareAtPrice} /></p>
                      <p className="text-xs text-gray-600 dark:text-white">
                        Size: {item.size} / Quantity: {item.quantity}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-white">Color: {item.color}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
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
              className="object-contain max-h-[18px] grayscale transition duration-200"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
