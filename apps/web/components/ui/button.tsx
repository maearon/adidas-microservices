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
  border?: boolean
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
  size = "default", // fallback
  ...props
}: ButtonProps) {
  const isBlack = theme === "black"
  const isIconButton = size === "icon"

  const bg = isBlack ? "bg-black" : "bg-white"
  const hoverBg = isBlack ? "hover:bg-black" : "hover:bg-white"
  const text = isBlack ? "text-white" : "text-black"
  const hoverText = isBlack ? "hover:text-gray-500" : "hover:text-black"
  const shadowBorderClass = isBlack
    ? "border-black"
    : "border-white group-hover:border-gray-400"
  const defaultBorder = isBlack ? "border-white" : "border-black"

  return (
    <div
      className={cn(
        "relative group",
        !isIconButton && (fullWidth ? "w-full" : "w-auto"),
      )}
    >
      {/* Shadow border */}
      {shadow && !isIconButton && (
        <span
          className={cn(
            "absolute inset-0 translate-x-[3px] translate-y-[3px] pointer-events-none z-0 transition-all border",
            shadowBorderClass
          )}
        />
      )}

      <BaseButton
        asChild={!!href}
        disabled={loading}
        variant={variant}
        size={size}
        className={cn(
          "relative z-10 inline-flex items-center justify-center px-4 h-12 font-bold text-base uppercase tracking-wide rounded-none transition-all",
          bg,
          hoverBg,
          text,
          hoverText,
          border && !isIconButton && "border",
          border && !isIconButton && defaultBorder,
          pressEffect && "active:translate-x-[3px] active:translate-y-[3px]",
          !isIconButton && (fullWidth ? "w-full" : "w-auto"),
          isIconButton && "w-auto h-auto p-2 text-black bg-white/70 hover:bg-white rounded-full",
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
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span className="mr-2 -translate-y-[1px]">{children}</span>
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
                  !isIconButton && "mr-2 -translate-y-[1px]"
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
