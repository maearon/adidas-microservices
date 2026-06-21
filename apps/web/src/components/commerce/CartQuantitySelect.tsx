"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslations } from "@/hooks/useTranslations"

export const CART_QUANTITY_MAX = 15

const QUANTITIES = Array.from({ length: CART_QUANTITY_MAX }, (_, index) => index + 1)

type CartQuantitySelectProps = {
  value: number
  onChange: (quantity: number) => void
}

export default function CartQuantitySelect({ value, onChange }: CartQuantitySelectProps) {
  const t = useTranslations("commerce")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  useEffect(() => {
    if (!open || !listRef.current) return
    const selected = listRef.current.querySelector<HTMLElement>(`[data-qty="${value}"]`)
    selected?.scrollIntoView({ block: "nearest" })
  }, [open, value])

  return (
    <div ref={rootRef} className="relative w-[100px]">
      <button
        type="button"
        aria-label={t?.cart?.qty ?? "Qty"}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-[51px] w-full items-center justify-between border border-foreground bg-background py-[11px] pl-[14px] pr-3 text-sm outline-none",
          open && "border-b-transparent",
        )}
      >
        <span>{value}</span>
        {open ? (
          <ChevronUp size={16} className="shrink-0" strokeWidth={1.5} />
        ) : (
          <ChevronDown size={16} className="shrink-0" strokeWidth={1.5} />
        )}
      </button>

      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={t?.cart?.selectQuantity ?? "Select quantity"}
          className="absolute left-0 top-[50px] z-20 max-h-[188px] w-full overflow-y-auto border border-foreground bg-background [scrollbar-color:#767677_#eceff1] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[10px] [&::-webkit-scrollbar-button]:block [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#767677] [&::-webkit-scrollbar-track]:bg-[#eceff1]"
        >
          {QUANTITIES.map((num) => (
            <li key={num} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={num === value}
                data-qty={num}
                onClick={() => {
                  onChange(num)
                  setOpen(false)
                }}
                className={cn(
                  "flex h-11 w-full items-center border-b border-border/70 pl-[14px] text-left text-sm hover:bg-muted/40",
                  num === value && "bg-muted/30",
                )}
              >
                {num}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
