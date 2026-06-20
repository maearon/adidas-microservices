"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { useTranslations } from "@/hooks/useTranslations"

interface TopBarDropdownProps {
  isOpen: boolean
  onClose: () => void
}

function UspSection({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions: ReactNode
}) {
  return (
    <div>
      <h2 className="mb-3 text-base font-bold uppercase leading-snug text-black dark:text-white md:mb-4">
        {title}
      </h2>
      <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300 md:mb-6">
        {description}
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2">{actions}</div>
    </div>
  )
}

function UspLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className="text-base font-bold uppercase text-black underline hover:no-underline dark:text-white"
    >
      {children}
    </Link>
  )
}

function UspPanelContent({ onClose }: { onClose: () => void }) {
  const t = useTranslations("topbar")

  return (
    <>
      <div className="flex justify-end px-4 pt-4 md:px-8 md:pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center border border-black dark:border-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="px-4 pb-8 md:px-16 md:pb-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <UspSection
            title={t?.extraDiscountTitle ?? "SAVE $30 ON ORDERS $100+"}
            description={
              t?.extraDiscountDescription ??
              "Save $30 on orders $100+ with code DEAL. Exclusions apply."
            }
            actions={
              <UspLink href="/sale">{t?.shopNow ?? "SHOP NOW"}</UspLink>
            }
          />

          <UspSection
            title={t?.freeStandardShippingTitle ?? "FREE STANDARD SHIPPING WITH ADICLUB"}
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
              "Get free shipping on all FIFA World Cup 26™ gear. Limited time offer."
            }
            actions={
              <>
                <UspLink href="/help">{t?.termsApply ?? "TERMS APPLY"}</UspLink>
                <UspLink href="/fifa_world_cup">{t?.shopNow ?? "SHOP NOW"}</UspLink>
              </>
            }
          />
        </div>
      </div>
    </>
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
    <div className="fixed inset-x-0 top-0 z-[70] hidden border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-black md:block">
      <UspPanelContent onClose={onClose} />
    </div>,
    document.body,
  )

  const mobilePanel = createPortal(
    <div className="fixed inset-0 z-[200] bg-white dark:bg-black md:hidden">
      <UspPanelContent onClose={onClose} />
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
