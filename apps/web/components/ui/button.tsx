"use client"

import { BaseButton, BaseButtonProps } from "@/components/ui/base-button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { ReactNode } from "react"

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

  const ButtonContent = (
    <div className="relative flex items-center justify-center gap-2">
      {/* Actual content always rendered to reserve space */}
      <span className={cn(loading && "invisible", "-translate-y-[1px]")}>
        {children}
      </span>

      {showArrow && (
        <span
          className={cn(
            "text-[22px] font-thin leading-none transition-opacity",
            loading && "invisible"
          )}
        >
          ⟶
        </span>
      )}

      {/* Loader overlaps center */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="h-5 w-5 animate-spin shrink-0" />
        </span>
      )}
    </div>
  )

  return (
    <div className={cn("relative inline-block group", fullWidth && "w-full")}>
      {shadow && (
        <span
          className={cn(
            "absolute top-0 left-0 w-full h-full translate-x-[3px] translate-y-[3px] pointer-events-none border box-border transition-all z-0",
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
          loading && "opacity-100", // đảm bảo không bị mờ khi disabled
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
            {ButtonContent}
          </Link>
        ) : (
          ButtonContent
        )}
      </BaseButton>
    </div>
  )
}
