// 📦 Order Service (NestJS Gateway)
// Handles: Order creation via NestJS Gateway microservices

import axios from "axios"
import { handleNetworkError } from "@/components/shared/handleNetworkError"
import { CartItem } from "@/store/cartSlice"

// Base URL cho NestJS Gateway
const NESTJS_GATEWAY_URL = process.env.NEXT_PUBLIC_NESTJS_GATEWAY_URL || "http://localhost:3000"

// Payload format cho NestJS Gateway
export interface OrderPayload {
  customerId: string
  items: Array<{
    sku: string
    qty: number
    price: number
  }>
  address?: {
    firstName?: string
    lastName?: string
    street?: string
    apartment?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
    phone?: string
    formattedAddress?: string
  }
}

// Response format từ Gateway
export interface OrderResponse {
  message: string
  orderId?: string
}

/**
 * Chuyển đổi CartItem từ Redux store sang format Gateway yêu cầu
 */
function mapCartItemsToGatewayFormat(cartItems: CartItem[]): OrderPayload['items'] {
  return cartItems.map((item) => {
    // Tạo SKU từ id + color + size (hoặc chỉ dùng id nếu không có variant)
    const sku = item.color && item.size 
      ? `${item.id}-${item.color}-${item.size}` 
      : `${item.id}`
    
    return {
      sku,
      qty: item.quantity,
      price: Number(item.price) || 0,
    }
  })
}

/**
 * Extract customerId từ session/user
 * Có thể dùng user.id, user.email, hoặc session.user.id
 */
export function getCustomerIdFromSession(user: { id?: string; email?: string } | null | undefined): string {
  if (!user) {
    // Guest user - tạo temporary ID từ localStorage hoặc sessionStorage
    const guestId = localStorage.getItem("guest_user_id") || `guest-${Date.now()}`
    if (!localStorage.getItem("guest_user_id")) {
      localStorage.setItem("guest_user_id", guestId)
    }
    return guestId
  }
  
  // Ưu tiên dùng user.id, nếu không có thì dùng email
  return user.id || user.email || `user-${Date.now()}`
}

const orderService = {
  /**
   * Tạo đơn hàng mới qua NestJS Gateway
   */
  async createOrder(
    cartItems: CartItem[],
    customerId: string,
    address?: OrderPayload["address"]
  ): Promise<OrderResponse | undefined> {
    try {
      // Validate input
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty")
      }

      if (!customerId) {
        throw new Error("Customer ID is required")
      }

      // Map cart items sang Gateway format
      const items = mapCartItemsToGatewayFormat(cartItems)

      // Tạo payload
      const payload: OrderPayload = {
        customerId,
        items,
        address,
      }

      // Gọi API đến NestJS Gateway
      const { data } = await axios.post<OrderResponse>(
        `${NESTJS_GATEWAY_URL}/orders`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      // Parse order ID từ response message
      // Format: "Order created with ID: {id} OK"
      const orderIdMatch = data.message?.match(/ID: (\d+)/)
      const parsedResponse: OrderResponse = {
        ...data,
        orderId: orderIdMatch ? orderIdMatch[1] : undefined,
      }

      return parsedResponse
    } catch (error: unknown) {
      handleNetworkError(error)
      throw error
    }
  },
}

export default orderService

