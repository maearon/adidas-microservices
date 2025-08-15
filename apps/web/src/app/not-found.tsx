"use client"

import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">PAGE NOT FOUND</h1>
      <div className="max-w-sm w-full">
        <input
          type="text"
          placeholder="SEARCH"
          className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 rounded-sm bg-white dark:bg-neutral-800 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>
      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
        Or return to the{" "}
        <Link href="/" className="underline hover:text-black dark:hover:text-white font-medium">
          Homepage
        </Link>{" "}
        and start again.
      </p>
    </div>
  )
}
