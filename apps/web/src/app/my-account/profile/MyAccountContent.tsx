"use client"

import Link from "next/link"

export default function MyAccountProfile() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-black rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">ACCOUNT OVERVIEW</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">PERSONAL INFORMATION</h3>
            <Link
              href="/my-account/profile"
              className="text-black dark:text-white hover:underline flex items-center justify-between p-3 border rounded"
            >
              <span>Edit your personal details</span>
              <span>→</span>
            </Link>
          </div>
          <div>
            <h3 className="font-bold mb-4">ADDRESS BOOK</h3>
            <Link
              href="/my-account/addresses"
              className="text-black dark:text-white hover:underline flex items-center justify-between p-3 border rounded"
            >
              <span>Manage your addresses</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">PREFERENCES</h2>
        <div className="space-y-3">
          <Link
            href="/my-account/preferences"
            className="flex items-center justify-between p-3 border rounded hover:bg-white dark:hover:bg-black"
          >
            <span>Communication preferences</span>
            <span>→</span>
          </Link>
          <Link
            href="/my-account/size-profile"
            className="flex items-center justify-between p-3 border rounded hover:bg-white dark:hover:bg-black"
          >
            <span>Size profile</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
