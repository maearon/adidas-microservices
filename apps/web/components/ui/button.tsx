"use client"

import { BaseButton, BaseButtonProps } from "@/components/ui/base-button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"

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
  border?: boolean
  sizeClass?: string
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
  border = true,
  size = "default",
  sizeClass = undefined,
  ...props
}: ButtonProps) {
  const isBlack = theme === "black"
  const isIconButton = size === "icon"

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [measuredWidth, setMeasuredWidth] = useState<number>()

  // 📏 Measure width only once when not loading
  useEffect(() => {
    if (!loading && buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width
      setMeasuredWidth(width)
    }
  }, [loading, children]) // Children changes may affect width

  const bg = isBlack ? "bg-black" : "bg-white"
  const hoverBg = isBlack ? "hover:bg-black" : "hover:bg-white"
  const text = isBlack ? "text-white" : "text-black"
  const hoverText = isBlack ? "hover:text-gray-500" : "hover:text-black"
  const shadowBorderClass = shadow
    ? isBlack
      ? "border-black"
      : "border-white group-hover:border-gray-400"
    : "border-transparent"
  const borderClass = !isIconButton
    ? shadow
      ? "border border-transparent"
      : `border ${isBlack ? "border-white" : "border-black"}`
    : ""

  return (
    <div
      className={cn(
        "relative group",
        !isIconButton &&
          (fullWidth
            ? "w-full sm:max-w-full" // ✅ allow buttons to expand on both mobile and desktop when needed
            : "w-auto sm:max-w-fit"), // full on mobile, auto on desktop
      )}
    >
      {shadow && !isIconButton && (
        <span
          className={cn(
            "absolute inset-0 translate-x-[3px] translate-y-[3px] pointer-events-none z-0 transition-all border",
            shadowBorderClass
          )}
        />
      )}

      <BaseButton
        ref={buttonRef}
        asChild={!!href}
        disabled={loading}
        variant={variant}
        size={size}
        style={{ minWidth: loading ? measuredWidth : undefined }}
        className={cn(
          "relative z-10 inline-flex items-center justify-between text-base font-bold uppercase tracking-wide rounded-none transition-all outline-hidden ring-0",
          bg,
          hoverBg,
          text,
          hoverText,
          !isIconButton && borderClass,
          pressEffect && "active:translate-x-[3px] active:translate-y-[3px]",

          // Padding responsive theo Adidas
          sizeClass ?? (!isIconButton &&
              "min-h-[48px] px-[15px] sm:min-h-[50px] sm:px-[15px]"),
          fullWidth ? "w-full" : "w-auto",
          isIconButton &&
            "w-auto h-auto p-2 text-black bg-white/70 hover:bg-white rounded-full",
          loading &&
            "btn-loading",
            
          className
        )}
        {...props}
      >
        {href ? (
          <Link
            href={href}
            onClick={(e) => loading && e.preventDefault()}
            className="w-full h-full flex items-center justify-between"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span className="-translate-y-px">{children}</span>
            )}
            {showArrow && !isIconButton && (
              <span className="text-[22px] font-thin leading-none">⟶</span>
            )}
          </Link>
        ) : (
          <>
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span
                className={cn(
                  "flex items-center",
                  !isIconButton && "-translate-y-px"
                )}
              >
                {children}
              </span>
            )}
            {showArrow && !isIconButton && !loading && (
              <span className="text-[22px] font-thin leading-none">⟶</span>
            )}
          </>
        )}
      </BaseButton>
    </div>
  )
}
