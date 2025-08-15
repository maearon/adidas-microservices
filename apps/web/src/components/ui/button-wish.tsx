"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "",
        link: "text-primary underline-offset-4",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 p-0"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonWishProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  pressEffect?: boolean
  shadow?: boolean
  showArrow?: boolean
  theme?: "black" | "white" | "gray"
  fullWidth?: boolean
}

const ButtonWish = React.forwardRef<HTMLButtonElement, ButtonWishProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      pressEffect = false,
      shadow = true,
      showArrow = false,
      theme = "white",
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const isIconButton = size === "icon"

    const baseTheme =
      theme === "black"
        ? "bg-black text-white disabled:bg-gray-400"
        : theme === "white"
        ? "bg-white text-black border border-black"
        : theme === "gray"
        ? "bg-neutral-100 text-black"
        : ""

    const boxShadow = shadow ? "shadow-[2px_2px_0px_#000]" : ""
    const fullWidthClass = fullWidth ? "w-full" : ""

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          baseTheme,
          boxShadow,
          fullWidthClass,
          pressEffect && "active:translate-y-[2px]",
          "font-bold uppercase rounded-none tracking-wider text-sm"
        )}
        ref={ref}
        {...props}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <>
            {isIconButton ? (
              children
            ) : (
              <span className="translate-y-[1px] flex items-center">
                {children}
                {showArrow && (
                  <span className="ml-1 text-lg leading-none">→</span>
                )}
              </span>
            )}
          </>
        )}
      </Comp>
    )
  }
)
ButtonWish.displayName = "ButtonWish"

export { ButtonWish, buttonVariants }
