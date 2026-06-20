"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "@/hooks/useTranslations"
import { cn } from "@/lib/utils"

interface TopBarDropdownProps {
  isOpen: boolean
  onClose: () => void
}

function UspSection({
  title,
  description,
  actions,
  stackedActions = false,
}: {
  title: string
  description: string
  actions: ReactNode
  stackedActions?: boolean
}) {
  return (
    <div className="text-left">
      <h2 className="mb-4 text-base font-bold uppercase leading-snug text-black dark:text-white">
        {title}
      </h2>
      <p className="mb-6 text-base leading-6 text-black dark:text-white">
        {description}
      </p>
      <div
        className={cn(
          stackedActions
            ? "flex flex-col items-start gap-4"
            : "flex flex-wrap gap-x-6 gap-y-2",
        )}
      >
        {actions}
      </div>
    </div>
  )
}

function UspLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="text-base font-bold uppercase text-black underline underline-offset-2 hover:no-underline dark:text-white"
    >
      {children}
    </Link>
  )
}

function UspPanelContent({
  onClose,
  variant,
}: {
  onClose: () => void
  variant: "desktop" | "mobile"
}) {
  const t = useTranslations("topbar")
  const isDesktop = variant === "desktop"

  return (
    <div
      className={cn(
        "relative mx-auto flex h-full w-full max-w-[1920px] flex-col bg-white dark:bg-black",
        isDesktop ? "px-16 pb-20 pt-6" : "overflow-y-auto px-4 pb-10 pt-4",
      )}
    >
      <div className={cn("flex shrink-0 justify-end", !isDesktop && "mb-6")}>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center border border-black dark:border-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={1.25} />
        </button>
      </div>

      <div
        className={cn(
          isDesktop
            ? "grid flex-1 grid-cols-3 gap-12 content-start"
            : "flex flex-col gap-12",
        )}
      >
        <UspSection
          title={t?.extraDiscountTitle ?? "SAVE $30 ON ORDERS $100+"}
          description={
            t?.extraDiscountDescription ??
            "Celebrate the new season with savings. Get $30 off when you spend $100 by using code DEAL at checkout. Exclusions apply."
          }
          actions={<UspLink href="/sale">{t?.shopNow ?? "SHOP NOW"}</UspLink>}
        />

        <UspSection
          title={
            t?.freeStandardShippingTitle ?? "FREE STANDARD SHIPPING WITH ADICLUB"
          }
          description={
            t?.freeStandardShippingDescription ??
            "Sign up for adiClub to enjoy free standard shipping and earn points on every order."
          }
          actions={
            <UspLink href="/join">{t?.joinAdiClubFree ?? "JOIN ADICLUB FOR FREE"}</UspLink>
          }
        />

        <UspSection
          title={t?.fifaShippingTitle ?? "FREE SHIPPING ON FIFA WORLD CUP 26™"}
          description={
            t?.fifaShippingDescription ??
            "Ready for the next match? Get free shipping with any method on FIFA World Cup 26™ gear and own a piece of history."
          }
          stackedActions
          actions={
            <>
              <UspLink href="/help">{t?.termsApply ?? "TERMS APPLY"}</UspLink>
              <UspLink href="/fifa_world_cup">{t?.shopNow ?? "SHOP NOW"}</UspLink>
            </>
          }
        />
      </div>
    </div>
  )
}

export default function TopBarDropdown({ isOpen, onClose }: TopBarDropdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const mq = window.matchMedia("(max-width: 767px)")
    if (mq.matches) {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const desktopBackdrop = createPortal(
    <div
      className="fixed inset-0 z-[65] hidden bg-black/50 md:block"
      onClick={onClose}
      aria-hidden
    />,
    document.body,
  )

  const desktopPanel = createPortal(
    <div className="fixed inset-x-0 top-0 z-[70] hidden h-[611px] border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-black md:block">
      <UspPanelContent onClose={onClose} variant="desktop" />
    </div>,
    document.body,
  )

  const mobilePanel = createPortal(
    <div className="fixed inset-0 z-[200] bg-white dark:bg-black md:hidden">
      <UspPanelContent onClose={onClose} variant="mobile" />
    </div>,
    document.body,
  )

  return (
    <>
      {desktopBackdrop}
      {desktopPanel}
      {mobilePanel}
    </>
  )
}
