"use client"

import { MapPin } from "lucide-react"

import { Store } from "@/types/store"
import { useTranslations } from "@/hooks/useTranslations"
import { calculateDistance } from "@/utils/distance"
import { cn } from "@/lib/utils"

export default function StoreList({
  stores,
  onSelect,
  selectedId,
  userLocation,
}: {
  stores: Store[]
  onSelect: (s: Store) => void
  selectedId: string
  userLocation: { lat: number; lng: number } | null
}) {
  const t = useTranslations("stores") as Record<string, string | undefined>

  return (
    <div className="space-y-2">
      {stores.map((store) => {
        const [lng, lat] = store.coordinates
        const isSelected = selectedId === store.id

        const distanceKm = userLocation
          ? calculateDistance(
              userLocation.lat,
              userLocation.lng,
              lat,
              lng
            )
          : null

        const distanceLabel =
          distanceKm !== null
            ? (t.kmAway || "{{distance}} km").replace(
                "{{distance}}",
                distanceKm.toFixed(1)
              )
            : null

        return (
          <div
            key={store.id}
            onClick={() => onSelect(store)}
            className={cn(
              "cursor-pointer rounded border p-3 transition-colors",
              isSelected
                ? "border-black dark:border-white"
                : "border-border hover:bg-muted/40"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold">{store.name}</p>
              {distanceLabel ? (
                <span className="shrink-0 text-xs font-medium">{distanceLabel}</span>
              ) : null}
            </div>

            <div className="mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded border px-4 py-2 text-sm transition hover:bg-gray-100 dark:hover:bg-muted"
              >
                <MapPin className="mr-2 h-5 w-5 text-red-600" />
                {t.directions || "Directions"}
              </a>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{store.address}</p>
            <p className="text-xs text-red-500">
              {t.openCloses || "Open Closes"}{" "}
              {store.hours.Sunday?.split("-")[1]?.trim() ?? ""}
            </p>
            <p className="text-sm text-blue-600 underline">{store.phone}</p>
          </div>
        )
      })}
    </div>
  )
}
