import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { BreadcrumbItem } from "@/types/bread-crumb"

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-base text-gray-600">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === items.length - 1 ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-gray-900">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}
