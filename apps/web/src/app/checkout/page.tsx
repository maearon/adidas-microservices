"use client"

import { useAppSelector, useAppDispatch } from "@/store/hooks" // ✅ dùng hook đúng
import { useEffect, useRef, useState } from "react"
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
import { formatPrice, getCountryFromLocale, normalizeLocale } from "@/lib/utils"
// import type { Session } from "@/lib/auth"
import ProductPrice from "@/components/ProductCardPrice"
import ProductPriceSpan from "@/components/ProductCardPriceSpan"
import { authClient } from "@/lib/auth-client";
// import { AcceptedPaymentMethods } from "@/app/(main)/cart/CartPageClient"
import Image from "next/image"
import { useTheme } from "next-themes"
import orderService, { getCustomerIdFromSession } from "@/api/services/orderService"
import { clearCart } from "@/store/cartSlice"
import { useRouter } from "next/navigation"
import PaymentMethods, { PaymentMethod } from "@/components/checkout/PaymentMethods"
import AddressAutocomplete, { AddressSuggestion } from "@/components/checkout/AddressAutocomplete"
import AddressList from "@/components/checkout/AddressList"
import StripePaymentForm, { StripePaymentFormHandle } from "@/components/checkout/StripePaymentForm"
import { Address } from "@/types/common/address"
import { ArrowLeft } from "lucide-react"

// type CheckoutPageProps = {
//   session: Session | null
// }

type CheckoutStep = 1 | 2 | 3 // 1 = Address, 2 = Shipping, 3 = Payment

export default function CheckoutPage() {
  const country = useAppSelector((state) => state.locale.locale) || normalizeLocale(navigator.language) // Mặc định là US English
  const [locale, setLocale] = useState(getCountryFromLocale(country))
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
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: locale || "US",
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
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [addressSearchValue, setAddressSearchValue] = useState("")
  const stripeFormRef = useRef<StripePaymentFormHandle>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)
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

  // const handleInputChange = (field: string, value: string) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }))
  //   if (selectedAddress && !selectedAddress._id) {
  //     const addressFieldMap: Record<string, keyof Address | null> = {
  //       firstName: "firstName",
  //       lastName: "lastName",
  //       street: "street",
  //       city: "city",
  //       state: "state",
  //       zipCode: "zipCode",
  //       country: "country",
  //       phone: "phone",
  //       address: "formattedAddress",
  //       email: null,
  //     }

  //     const targetField = addressFieldMap[field]
  //     if (targetField) {
  //       setSelectedAddress((prev) => (prev ? { ...prev, [targetField]: value } : prev))
  //     }
  //   }
  //   // Clear error when user starts typing
  //   if (errors[field as keyof typeof errors]) {
  //     setErrors((prev) => ({ ...prev, [field]: "" }))
  //   }
  // }

  const handleLocaleChange = (value: string) => {
    setLocale(value) // chỉ set trong màn checkout
  }

  const validateAddressStep = () => {
    const newErrors = {
      firstName: !formData.firstName ? "Please enter your first name." : "",
      lastName: !formData.lastName ? "Please enter your last name." : "",
      address: !selectedAddress && !formData.address ? "Please enter or select your delivery address." : "",
      phone: !formData.phone ? "Please enter your telephone number." : "",
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const validateShippingStep = () => {
    // Shipping step is usually just informational, but we can add validation if needed
    return true
  }

  const validatePaymentStep = () => {
    if (!selectedPaymentMethod) {
      setOrderError("Please select a payment method.")
      return false
    }
    return true
  }

  const handleAddressSelect = (address: Address | null) => {
    if (!address) {
      setSelectedAddress(null)
      return
    }

    setSelectedAddress(address)
    setFormData((prev) => ({
      ...prev,
      firstName: address.firstName || prev.firstName,
      lastName: address.lastName || prev.lastName,
      street: address.street || prev.street,
      city: address.city || prev.city,
      state: address.state || prev.state,
      zipCode: address.zipCode || prev.zipCode,
      country: address.country || prev.country,
      phone: address.phone || prev.phone,
      address: address.formattedAddress || address.street || prev.address,
    }))
    setAddressSearchValue(address.formattedAddress || address.street || "")
  }

  const handleAddressAutocompleteSelect = (address: AddressSuggestion) => {
    const normalizedAddress: Address = {
      _id: undefined,
      userId: undefined,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: address.street,
      apartment: "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: formData.phone,
      isDefault: false,
      type: "delivery",
      latitude: address.latitude,
      longitude: address.longitude,
      formattedAddress: address.formattedAddress,
    }

    setFormData((prev) => ({
      ...prev,
      street: address.street || prev.street,
      city: address.city || prev.city,
      state: address.state || prev.state,
      zipCode: address.zipCode || prev.zipCode,
      country: address.country || prev.country,
      address: address.formattedAddress || prev.address,
    }))
    setSelectedAddress(normalizedAddress)
    setAddressSearchValue(address.formattedAddress || "")
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateAddressStep()) {
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (!validateShippingStep()) {
        return
      }
      setCurrentStep(3)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as CheckoutStep)
    }
  }

  const handleNext = () => {
    // Placeholder for promo code application logic
    alert("Promo code applied!")
  }

  const handlePlaceOrder = async () => {
    if (!validatePaymentStep()) {
      return
    }

    // Validate cart
    if (!cartItems || cartItems.length === 0) {
      setOrderError("Your cart is empty. Please add items before checkout.")
      return
    }

    setIsSubmitting(true)
    setOrderError(null)

    try {
      // Lấy customerId từ session
      const customerId = getCustomerIdFromSession(session?.user)

      // Prepare address data
      const fallbackFormattedAddress =
        formData.address ||
        [formData.street, formData.city, formData.state, formData.zipCode, formData.country]
          .filter(Boolean)
          .join(", ")

      const addressData: Address = selectedAddress
        ? selectedAddress
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street || formData.address,
            apartment: "",
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
            phone: formData.phone,
            formattedAddress: fallbackFormattedAddress,
          }

      if (selectedPaymentMethod === "stripe") {
        if (!stripeFormRef.current) {
          throw new Error("Stripe payment form is not ready. Please try again.")
        }

        const { paymentIntentId } = await stripeFormRef.current.confirmPayment()

        const orderResponse = await orderService.createOrder(
          cartItems,
          customerId,
          addressData,
          paymentIntentId,
        )

        if (!orderResponse || !orderResponse.orderId) {
          throw new Error(
            "Payment succeeded but order creation failed. Please contact support.",
          )
        }

        dispatch(clearCart())
        router.push(
          `/order-confirmation?orderId=${orderResponse.orderId}&payment=${selectedPaymentMethod}`,
        )
        return
      }

      // Gọi API tạo order trước (các phương thức khác)
      const orderResponse = await orderService.createOrder(cartItems, customerId, addressData)

      if (!orderResponse || !orderResponse.orderId) {
        throw new Error("Failed to create order")
      }

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
      } else {
        // PayPal or other - redirect to confirmation
        dispatch(clearCart())
        router.push(`/order-confirmation?orderId=${orderResponse.orderId}&payment=${selectedPaymentMethod}`)
      }
    } catch (error: unknown) {
      console.error("Error processing order:", error)
      const message =
        error instanceof Error
          ? error.message
          : "Failed to process order. Please try again."
      setOrderError(message)
      if (selectedPaymentMethod === "stripe") {
        setStripeError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasMounted || userLoading) return <FullScreenLoader />

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"
  const derivedAddressSummary =
    selectedAddress?.formattedAddress ||
    formData.address ||
    [formData.street, formData.city, formData.state, formData.zipCode, formData.country].filter(Boolean).join(", ")

  const derivedPhone = selectedAddress?.phone || formData.phone

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">CHECKOUT</h1>
        <p className="text-gray-600 dark:text-white">
          [{totalItems} items] <ProductPriceSpan price={total} compareAtPrice={null} />
        </p>
      </div>

      {/* Step Indicator */}
      {/* <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center ${currentStep >= 1 ? "text-black dark:text-white" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700"}`}>
              1
            </div>
            <span className="ml-2 font-medium">Address</span>
          </div>
          <div className={`w-12 h-0.5 ${currentStep >= 2 ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"}`} />
          <div className={`flex items-center ${currentStep >= 2 ? "text-black dark:text-white" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700"}`}>
              2
            </div>
            <span className="ml-2 font-medium">Shipping</span>
          </div>
          <div className={`w-12 h-0.5 ${currentStep >= 3 ? "bg-black dark:bg-white" : "bg-gray-300 dark:bg-gray-600"}`} />
          <div className={`flex items-center ${currentStep >= 3 ? "text-black dark:text-white" : "text-gray-400"}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-black dark:bg-white text-white dark:text-black" : "bg-gray-200 dark:bg-gray-700"}`}>
              3
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Left Column - Checkout Form */}
        <div className="space-y-12">
          {/* Contact Section - Always visible */}
          {/* <div>
            <h2 className="text-lg font-bold mb-4">CONTACT</h2>
            <p className="text-base text-gray-600 dark:text-white">{session?.user?.email || "guest@gmail.com"}</p>
          </div> */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">CONTACT</h2>
              <p className="text-base text-gray-600 dark:text-white">
                {session?.user?.email || "guest@gmail.com"}
              </p>
            </div>

            {/* Dropdown chọn quốc gia */}
            <select
              value={locale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              className="text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-none px-3 py-2 text-sm focus:outline-none"
            >
              <option value="US">🇺🇸 United States</option>
              <option value="VN">🇻🇳 Việt Nam</option>
              <option value="JP">🇯🇵 Japan</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="FR">🇫🇷 France</option>
            </select>
          </div>

          {/* Step 1: Address Section */}
          {(currentStep === 1 || currentStep === 2 || currentStep === 3) && (
            <div>
              <div className="opacity-40 h-px bg-gray-400 dark:bg-gray-500 my-8" />
              <h2 className="text-lg font-bold mb-4">ADDRESS</h2>
              <h3 className="font-medium mb-4">Delivery address</h3>

              <div className="space-y-4">
                {/* Saved Addresses List */}
                <AddressList
                  selectedAddress={selectedAddress}
                  onSelectAddress={handleAddressSelect}
                  country={locale || "US"}
                />

                {/* <div className="text-sm text-gray-500 text-center my-4">OR</div> */}

                {/* Manual Address Entry */}
                <div className="space-y-4">
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Input
                        placeholder="Last Name *"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div> */}

                  {/* Address Autocomplete */}
                  {/* <div>
                    <AddressAutocomplete
                      value={addressSearchValue}
                      onChange={setAddressSearchValue}
                      onSelect={handleAddressAutocompleteSelect}
                      placeholder="Find delivery address *"
                      country={formData.country}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div> */}

                  {/* Phone Field */}
                  {/* <div>
                    <Input
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div> */}

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveInfo: !!checked }))}
                      />
                      <label htmlFor="saveInfo" className="text-sm">
                        Save address and contact information for future orders
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ageVerified"
                        checked={formData.ageVerified}
                        onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, ageVerified: !!checked }))}
                      />
                      <label htmlFor="ageVerified" className="text-sm font-medium">
                        I&apos;m 13+ years old. *
                      </label>
                    </div>
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
                    onClick={handleNextStep}
                    fullWidth={true}
                    border
                    shadowColorModeInWhiteTheme="black"
                    theme={isDark ? "white" : "black"}
                    disabled={cartItems.length === 0}
                  >
                    NEXT
                    {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Shipping Section */}
          {(currentStep === 2 || currentStep === 3) ? (
            <div>
              <div className="opacity-40 h-px bg-gray-400 dark:bg-gray-500 my-8" />
              <h2 className="text-lg font-bold mb-4">SHIPPING</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded">
                  <h3 className="font-medium mb-2">Standard Delivery</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Free</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Estimated delivery: 5-7 business days
                  </p>
                </div>

                {/* Selected Address Summary */}
                {derivedAddressSummary && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                    <h3 className="text-sm font-medium mb-2">Delivery to:</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {derivedAddressSummary}
                    </p>
                    {derivedPhone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Phone: {derivedPhone}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="flex-1"
                    border
                    showArrow={false}
                    pressEffect={true}
                    shadowColorModeInWhiteTheme="black"
                    theme={isDark ? "black" : "white"}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    pressEffect={true}
                    onClick={handleNextStep}
                    fullWidth={true}
                    border
                    shadowColorModeInWhiteTheme="black"
                    theme={isDark ? "white" : "black"}
                    className="flex-1"
                  >
                    NEXT
                    {/* <ArrowRight className="ml-2 h-5 w-5" /> */}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="opacity-40 pointer-events-none select-none">
              <div className="opacity-40 h-px bg-gray-400 dark:bg-gray-500 my-8" />
              <h2 className="text-lg font-bold mb-4 text-gray-400 dark:text-gray-500">SHIPPING</h2>        
            </div>
          )
          }

          {/* Step 3: Payment Section */}
          {currentStep === 3 ? (
            <div>
              <div className="opacity-40 h-px bg-gray-400 dark:bg-gray-500 my-8" />
              <h2 className="text-lg font-bold mb-4">PAYMENT</h2>
              
              <div className="space-y-4">
                <PaymentMethods
                  selectedMethod={selectedPaymentMethod}
                  onSelectMethod={(method) => {
                    setSelectedPaymentMethod(method)
                    if (method !== "stripe") {
                      setStripeError(null)
                    }
                  }}
                  country={formData.country || "US"}
                  stripeForm={
                    <StripePaymentForm
                      ref={stripeFormRef}
                      amount={total}
                      currency="usd"
                      customerEmail={session?.user?.email || formData.email}
                      onError={setStripeError}
                    />
                  } // truyền form thật vào đây
                  stripeError={stripeError}
                />

                {/* Error Message */}
                {orderError && (
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded text-red-700 dark:text-red-400 text-sm">
                    {orderError}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    className="flex-1"
                    border
                    showArrow={false}
                    pressEffect={true}
                    shadowColorModeInWhiteTheme="black"
                    theme={isDark ? "black" : "white"}
                  >
                    <ArrowLeft size={16} />
                    Back
                  </Button>
                  <Button
                    pressEffect={true}
                    onClick={handlePlaceOrder}
                    fullWidth={true}
                    border
                    shadowColorModeInWhiteTheme="black"
                    theme={isDark ? "white" : "black"}
                    disabled={isSubmitting || cartItems.length === 0}
                    className="flex-1"
                  >
                    {isSubmitting ? "PROCESSING..." : "PLACE ORDER"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="opacity-40 pointer-events-none select-none">
              <div className="opacity-40 h-px bg-gray-400 dark:bg-gray-500 my-8" />
              <h2 className="text-lg font-bold mb-4 text-gray-400 dark:text-gray-500">PAYMENT</h2>
              <div className="flex items-center gap-2 mb-4">
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
                ].map((img, idx) => (
                  <div key={idx} className="w-12 h-8 relative">
                    <Image
                      src={img.src ?? "/placeholder.png"}
                      alt={img.alt ?? "Payment Method"}
                      fill
                      className="object-contain grayscale"
                    />
                  </div>
                ))}
              </div>
            </div>
          )
          }
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
