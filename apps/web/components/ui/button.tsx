"use client"

import { BaseButton, BaseButtonProps } from "@/components/ui/base-button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"
import { useMemo } from "react"

interface ButtonProps extends BaseButtonProps {
  href?: string
  children: ReactNode
  loading?: boolean
  showArrow?: boolean
  shadow?: boolean
  pressEffect?: boolean
  fullWidth?: boolean
  className?: string
  theme?: "white" | "black"
}

export function Button({
  href,
  children,
  loading = false,
  showArrow = true,
  shadow = true,
  pressEffect = false,
  fullWidth = false,
  variant = "default",
  className,
  theme = "white",
  ...props
}: ButtonProps) {
  const isBlack = theme === "black"

  const bg = isBlack ? "bg-black" : "bg-white"
  const hoverBg = isBlack ? "hover:bg-black" : "hover:bg-white"
  const text = isBlack ? "text-white" : "text-black"
  const hoverText = isBlack ? "hover:text-gray-500" : "hover:text-black"
  const borderColor = isBlack ? "border-black" : "border-white"
  const shadowBorderClass = isBlack
    ? "border-black"
    : "border-white group-hover:border-gray-400"

  // ⏱ Render nội dung cố định (kể cả loading) để tránh nhảy layout
  const content = useMemo(() => (
    <>
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin shrink-0" />
        ) : (
          <span className="-translate-y-[1px]">{children}</span>
        )}
        {/* Giữ chỗ cho arrow kể cả khi loading */}
        {showArrow && (
          <span
            className={cn(
              "text-[22px] font-thin leading-none transition-opacity",
              loading ? "opacity-0" : "opacity-100"
            )}
          >
            ⟶
          </span>
        )}
      </span>
    </>
  ), [loading, children, showArrow])

  return (
    <div className={cn("relative inline-block group", fullWidth && "w-full")}>
      {shadow && (
        <span
          className={cn(
            "absolute top-0 left-0 w-full h-full translate-x-[3px] translate-y-[3px] pointer-events-none z-0 transition-all border box-border",
            shadowBorderClass
          )}
        />
      )}

      <BaseButton
        asChild={!!href}
        disabled={loading}
        variant={variant}
        className={cn(
          "relative z-10 inline-flex items-center justify-center px-4 h-12 font-bold text-base uppercase tracking-wide rounded-none transition-all border whitespace-nowrap",
          bg,
          hoverBg,
          text,
          hoverText,
          borderColor,
          pressEffect && "active:translate-x-[3px] active:translate-y-[3px]",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {href ? (
          <Link
            href={href}
            onClick={(e) => loading && e.preventDefault()}
            className="w-full h-full flex items-center justify-center"
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </BaseButton>
    </div>
  )
}
