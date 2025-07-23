"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { BreadcrumbItem } from "@/types/bread-crumb"
import { cn } from "@/lib/utils"

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
  showBackButton?: boolean
}

export default function Breadcrumb({
  items,
  className = "",
  showBackButton = true,
}: BreadcrumbProps) {
  const router = useRouter()

  function handleBack() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className={cn("flex items-center gap-2 mb-6", className)}>
      {showBackButton && (
        <>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm hover:bg-black hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
            BACK
          </button>
          <span className="text-gray-400 cursor-default">/</span>
        </>
      )}

      <Link href="/" className="text-sm hover:underline">
        Home
      </Link>

      {items.map((crumb, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-400 cursor-default">/</span>
            {isLast ? (
              <span className="text-sm text-gray-600 cursor-default select-none">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="text-sm hover:underline hover:bg-black hover:text-white">
                {crumb.label}
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
