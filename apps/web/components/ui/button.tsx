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
  className,
  theme = "white",
  ...props
}: ButtonProps) {
  const isBlack = theme === "black"

  const bg = isBlack ? "bg-black" : "bg-white"
  const hoverBg = isBlack ? "bg-black" : "bg-white"
  const text = isBlack ? "text-white" : "text-black"
  const hoverText = isBlack ? "hover:text-gray-500" : "hover:text-black"
  const borderColor = isBlack ? "border-black" : "border-white" // for look good
  const hoverBorder = isBlack ? "border-black" : "group-hover:border-gray-400"

  return (
    <div className={cn("relative group", fullWidth && "w-full")}>
      {shadow && (
        <span
          className={cn(
            "absolute inset-0 translate-x-[3px] translate-y-[3px] pointer-events-none z-0 transition-all border",
            borderColor,
            hoverBorder,
            "group-active:translate-x-[3px] group-active:translate-y-[3px]"
          )}
        />
      )}

      <BaseButton
        asChild={!!href}
        disabled={loading}
        variant={undefined} // ✅ not use variant
        className={cn(
          "relative z-10 inline-flex items-center justify-center px-4 h-12 font-bold text-base uppercase tracking-wide rounded-none transition-all border",
          bg,
          hoverBg,
          text,
          hoverText,
          borderColor,
          pressEffect && "active:translate-x-[3px] active:translate-y-[3px]", // 👈 active pseudo-class toggle
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
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span className="mr-2 -translate-y-[1px]">{children}</span>
            )}
            {showArrow && (
              <span className="text-[22px] font-thin leading-none">⟶</span>
            )}
          </Link>
        ) : (
          <>
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <span className="mr-2 -translate-y-[1px]">{children}</span>
            )}
            {showArrow && (
              <span className="text-[22px] font-thin leading-none">⟶</span>
            )}
          </>
        )}
      </BaseButton>
    </div>
  )
}
