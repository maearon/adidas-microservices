"use client"

import { MapPin } from "lucide-react"

import { Store } from "@/types/store"
import { useTranslations } from "@/hooks/useTranslations"
import { calculateDistance } from "@/utils/distance"

export default function StoreDetail({
  store,
  userLocation,
}: {
  store: Store
  userLocation?: { lat: number; lng: number } | null
}) {
  const t = useTranslations("stores") as Record<string, string | undefined>
  const [lng, lat] = store.coordinates

  const distanceMi =
    userLocation != null
      ? calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng
        ) * 0.621371
      : store.distance

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold">{store.name}</h3>

      <div className="mt-3">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded border px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-muted"
        >
          <MapPin className="mr-2 h-5 w-5 text-red-600" />
          {t.directions || "Directions"}
        </a>
      </div>

      <p className="mt-2 text-sm font-semibold">{t.address || "Address:"}</p>
      <p className="mb-2 text-sm">
        {store.address} ({distanceMi.toFixed(2)} mi)
      </p>
      <div className="mb-2">
        {Object.entries(store.hours).map(([day, hours]) => (
          <p key={day} className="text-sm">
            <strong>{day}:</strong> {hours}
          </p>
        ))}
      </div>
      <p className="text-sm text-blue-600 underline">{store.phone}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {store.features.map((f) => (
          <span
            key={f}
            className="rounded border bg-gray-100 px-2 py-1 text-xs text-black dark:bg-muted dark:text-foreground"
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
