"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface SalePromoProps {
  message?: string
  bgColor?: string
  textColor?: string
  className?: string
}

export default function SalePromo({
  message = "UP TO 40% OFF",
  bgColor = "bg-cyan-700", // Đổi từ bg-red-600 sang bg-cyan-700
  textColor = "text-background",
  className = "",
}: SalePromoProps) {
  return (
    <div className={cn("p-4 text-center", bgColor, textColor, className)}>
      <p className="font-bold">{message}</p>
    </div>
  )
}
