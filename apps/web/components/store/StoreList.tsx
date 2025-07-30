// components/store/StoreList.tsx

import { Store } from "@/types/store"
import { MapPin } from "lucide-react"

export default function StoreList({
  stores,
  onSelect,
  selectedId,
}: {
  stores: Store[]
  onSelect: (s: Store) => void
  selectedId: string
}) {
  return (
    <div className="space-y-2">
      {stores.map((store) => {
        const [lng, lat] = store.coordinates
        return (
        <div
          key={store.id}
          onClick={() => onSelect(store)}
          className={`border rounded p-3 cursor-pointer ${selectedId === store.id ? 'border-black' : ''}`}
        >
          <p className="font-semibold">{store.name}</p>
          {/* Directions button */}
          <div className="mt-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border px-4 py-2 rounded hover:bg-gray-100 transition text-sm"
            >
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Directions
            </a>
          </div>

          {/* Address label */}
          <p className="text-sm text-muted-foreground">{store.address}</p>
          <p className="text-xs text-red-500">Open Closes {store.hours['Sunday'].split('-')[1]}</p>
          <p className="text-sm text-blue-600 underline">{store.phone}</p>
        </div>
         )
      })}
    </div>
  )
}
