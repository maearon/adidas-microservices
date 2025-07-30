// components/store/StoreDetail.tsx
import { Store } from "@/types/store";
import { MapPin } from "lucide-react"

export default function StoreDetail({ store }: { store: Store }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">{store.name}</h3>

      {/* Nút Directions */}
      <div className="mt-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            store.address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center border px-4 py-2 rounded hover:bg-gray-100 transition text-sm"
        >
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11v10"
            />
          </svg> */}
          <MapPin className="h-5 w-5 mr-2 text-red-600" />
          Directions
        </a>
      </div>

      {/* Address label */}
      <p className="font-semibold text-sm mt-2">Address:</p>
      <p className="text-sm mb-2">
        {store.address} ({store.distance.toFixed(2)} mi)
      </p>
      <div className="mb-2">
        {Object.entries(store.hours).map(([day, hours]) => (
          <p key={day} className="text-sm">
            <strong>{day}:</strong> {hours}
          </p>
        ))}
      </div>
      <p className="text-sm text-blue-600 underline">{store.phone}</p>

      {/* Features */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {store.features.map((f) => (
          <span
            key={f}
            className="text-xs px-2 py-1 bg-gray-100 rounded border"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
