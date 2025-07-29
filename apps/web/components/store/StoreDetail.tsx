// components/store/StoreDetail.tsx
import { Store } from "@/types/store";

export default function StoreDetail({ store }: { store: Store }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">{store.name}</h3>
      <p className="text-sm mb-2">{store.address} ({store.distance.toFixed(2)} mi)</p>
      <div className="mb-2">
        {Object.entries(store.hours).map(([day, hours]) => (
          <p key={day} className="text-sm">
            <strong>{day}:</strong> {hours}
          </p>
        ))}
      </div>
      <p className="text-sm text-blue-600 underline">{store.phone}</p>
      <div className="flex gap-2 mt-3 flex-wrap">
        {store.features.map((f) => (
          <span key={f} className="text-xs px-2 py-1 bg-gray-100 rounded border">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
