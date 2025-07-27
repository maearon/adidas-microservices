"use client"

import Link from "next/link"
import Image from "next/image"

export default function PromoBanner() {
  return (
    <Link
      href="/new_to_sale"
      className="block w-full bg-[#e9edf0] hover:opacity-90 transition"
    >
      <div className="relative flex items-center px-4 pt-3 pb-4 md:px-6 md:pt-3 md:pb-4">
        <p className="text-base text-gray-800 mx-auto pr-8 md:pr-10">
          Get a free backpack with orders $150+, while supplies last.
        </p>
        <span className="text-2xl absolute right-4 md:right-6">→</span>
      </div>
    </Link>
  )
}
