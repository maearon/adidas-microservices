'use client'

import { useState } from 'react'
import StoreList from '@/components/store/StoreList'
import StoreMap from '@/components/store/StoreMap'
import StoreDetail from '@/components/store/StoreDetail'
import { stores } from '@/data/stores'
import { Store } from '@/types/store'

export default function StoreFinderPage() {
  const [selectedStore, setSelectedStore] = useState<Store>(stores[0])

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar - Full width on mobile, fixed width on desktop */}
      <div className="w-full xl:w-[320px] border-r overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">STORE FINDER</h2>
        <input
          className="mb-4 w-full border rounded px-3 py-2 text-sm"
          placeholder="Search city, zip, or address"
        />
        <StoreList
          stores={stores}
          onSelect={setSelectedStore}
          selectedId={selectedStore.id}
        />
      </div>

      {/* Map and Detail - Hidden on mobile */}
      <div className="hidden xl:flex flex-1 relative">
        <StoreMap stores={stores} selected={selectedStore} />
        <div className="absolute top-4 right-4 bg-background shadow-lg rounded-lg max-w-md w-full z-10">
          <StoreDetail store={selectedStore} />
        </div>
      </div>
    </div>
  )
}
