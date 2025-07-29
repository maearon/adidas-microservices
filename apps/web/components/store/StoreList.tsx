// components/store/StoreList.tsx

import { Store } from "@/types/store"

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
      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onSelect(store)}
          className={`border rounded p-3 cursor-pointer ${selectedId === store.id ? 'border-black' : ''}`}
        >
          <p className="font-semibold">{store.name}</p>
          <p className="text-sm text-muted-foreground">{store.address}</p>
          <p className="text-xs text-red-500">Open Closes {store.hours['Sunday'].split('-')[1]}</p>
        </div>
      ))}
    </div>
  )
}
