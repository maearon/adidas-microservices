"use client"

import type React from "react"

import { Heart } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { toggleWishlist } from "@/store/wishlistSlice"
import { cn } from "@/lib/utils"
import { WishlistItem } from "@/types/wish"

interface WishButtonProps {
  item: WishlistItem
  className?: string
  size?: number
}

export default function WishButton({ item, className, size = 24 }: WishButtonProps) {
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)

  const isWishlisted = wishlistItems.some((wishItem) => wishItem.id === item.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(item))
  }

  return (
    <button onClick={handleToggleWishlist} className={cn("hover:scale-110 transition-transform", className)}>
      <Heart
        size={size}
        className={cn("transition-colors", isWishlisted ? "fill-black text-black dark:text-black" : "text-black dark:text-black")}
      />
    </button>
  )
}
