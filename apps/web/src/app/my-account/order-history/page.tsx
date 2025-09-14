"use client"

import Link from "next/link"

export default function OrderHistory() {
  return (
    <div className="bg-white dark:bg-black rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">NO ORDERS YET</h2>
      <p className="text-gray-600 dark:text-white mb-6">Once you place an order, it will appear here.</p>
      <Link
        href="/"
        className="inline-block bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition"
      >
        START SHOPPING
      </Link>
    </div>
  )
}
