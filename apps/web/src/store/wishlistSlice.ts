import { isSameWishItem, wishItemKey } from "@/lib/commerce/line-keys"
import { WishlistItem, WishlistState } from "@/types/wish"
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialState: WishlistState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some((item) => isSameWishItem(item, action.payload))
      if (!exists) {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      const key = String(action.payload)
      state.items = state.items.filter(
        (item) => item.id !== action.payload && wishItemKey(item) !== key,
      )
    },
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some((item) => isSameWishItem(item, action.payload))
      if (exists) {
        state.items = state.items.filter((item) => !isSameWishItem(item, action.payload))
      } else {
        state.items.push(action.payload)
      }
    },
    clearWishlist: (state) => {
      state.items = []
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload
    },
  },
})

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
  setWishlistItems,
} = wishlistSlice.actions
export default wishlistSlice.reducer
