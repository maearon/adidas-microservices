import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CartItem {
  id: number
  productId?: string
  variantId?: string
  variantCode?: string
  slug?: string
  url?: string
  name: string
  price: number   // <-- sửa string thành number
  compareAtPrice?: number | null // <-- thêm trường này nếu cần
  image: string
  color?: string
  size?: string
  quantity: number
  customization?: {
    name?: string
    number?: string
  }
}

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) =>
          (item.variantId && action.payload.variantId
            ? item.variantId === action.payload.variantId
            : item.id === action.payload.id) &&
          item.color === action.payload.color &&
          item.size === action.payload.size,
      )

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload && item.variantId !== String(action.payload),
      )
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } = cartSlice.actions
export default cartSlice.reducer
