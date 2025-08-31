"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BreadcrumbItem } from "@/types/bread-crumb"
import { useTranslations } from "@/hooks/useTranslations"

type BreadcrumbForDetailProductPageProps = {
  items: BreadcrumbItem[]
  className?: string
  showBackButton?: boolean
}

export default function BreadcrumbForDetailProductPage({
  items,
  className = "",
  showBackButton = true,
}: BreadcrumbForDetailProductPageProps) {
  const router = useRouter()
  const t = useTranslations("common")

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <nav
      className={`absolute top-4 left-4 z-20 hidden sm:flex items-center px-2 py-1 rounded ${className}`}
    >
      {showBackButton && (
        <>
          <button
            onClick={handleBack}
            className="flex items-center bg-transparent text-gray-700 px-2 py-1 hover:bg-black hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="underline-offset-2">{t?.back || "Back"}</span>
          </button>
        </>
      )}

      {/* Home link */}
      <Link
        href="/"
        className="hover:bg-black hover:text-white hover:underline transition-colors px-2 py-1 rounded-none text-gray-700"
      >
        {t?.home || "Home"}
      </Link>

      {items.map((crumb, index) => (
        <span key={index} className="flex items-center text-gray-700">
          <span className="mx-1 text-gray-500">/</span>
          <Link
            href={crumb.href}
            className="hover:bg-black hover:text-white hover:underline transition-colors px-2 py-1 rounded-none"
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  )
}
