"use client"

import { useEffect, useRef, useState } from "react"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import { Store } from "@/types/store"
import {
  googleMapsDirectionsEmbedUrl,
  googleMapsEmbedUrl,
} from "@/lib/maps"
import { cn } from "@/lib/utils"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

const ROUTE_SOURCE_ID = "store-route"
const ROUTE_LAYER_ID = "store-route-line"
const STORE_MARKER_COLOR = "#000000"
const ROUTE_LINE_COLOR = "#000000"

type StoreMapProps = {
  stores: Store[]
  selected: Store
  userLocation: { lat: number; lng: number } | null
  isUserAtSelectedStore: boolean
}

function createMarkerElement(color: string, options?: { active?: boolean }) {
  const root = document.createElement("div")
  root.className = "relative flex items-center justify-center"
  root.style.width = "18px"
  root.style.height = "18px"

  const dot = document.createElement("span")
  dot.className = "block rounded-full border-2 border-white shadow-md"
  dot.style.width = "14px"
  dot.style.height = "14px"
  dot.style.backgroundColor = color

  if (options?.active) {
    root.style.outline = "2px solid #000000"
    root.style.outlineOffset = "2px"
    root.style.borderRadius = "9999px"
  }

  root.appendChild(dot)
  return root
}

function GoogleMapFallback({
  selected,
  userLocation,
  isUserAtSelectedStore,
}: Pick<StoreMapProps, "selected" | "userLocation" | "isUserAtSelectedStore">) {
  const [destLng, destLat] = selected.coordinates

  const src =
    userLocation && !isUserAtSelectedStore
      ? googleMapsDirectionsEmbedUrl(
          userLocation.lat,
          userLocation.lng,
          destLat,
          destLng
        )
      : googleMapsEmbedUrl(destLat, destLng, 14)

  return (
    <iframe
      key={`${selected.id}-${userLocation?.lat ?? "none"}-${userLocation?.lng ?? "none"}`}
      title={selected.name}
      src={src}
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  )
}

async function fetchRouteGeometry(
  origin: [number, number],
  destination: [number, number],
  token: string
) {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${token}`
  )

  if (!response.ok) return null

  const data = await response.json()
  return data.routes?.[0]?.geometry ?? null
}

function upsertRouteLayer(
  map: mapboxgl.Map,
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString
) {
  const feature: GeoJSON.Feature = {
    type: "Feature",
    properties: {},
    geometry,
  }

  if (map.getSource(ROUTE_SOURCE_ID)) {
    ;(map.getSource(ROUTE_SOURCE_ID) as mapboxgl.GeoJSONSource).setData(feature)
    return
  }

  map.addSource(ROUTE_SOURCE_ID, {
    type: "geojson",
    data: feature,
  })

  map.addLayer({
    id: ROUTE_LAYER_ID,
    type: "line",
    source: ROUTE_SOURCE_ID,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ROUTE_LINE_COLOR,
      "line-width": 4,
      "line-opacity": 0.85,
    },
  })
}

function removeRouteLayer(map: mapboxgl.Map) {
  if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID)
  if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID)
}

export default function StoreMap({
  stores,
  selected,
  userLocation,
  isUserAtSelectedStore,
}: StoreMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [mapReady, setMapReady] = useState(false)
  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN)

  useEffect(() => {
    if (!hasToken || !containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [105.34, 20.84],
      zoom: 12,
      attributionControl: false,
    })

    mapRef.current = map
    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right"
    )

    map.on("load", () => setMapReady(true))

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
      setMapReady(false)
    }
  }, [hasToken])

  useEffect(() => {
    const map = mapRef.current
    if (!hasToken || !map || !mapReady) return

    const renderMarkersAndRoute = async () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []

      stores.forEach((store) => {
        const isSelected = store.id === selected.id
        const marker = new mapboxgl.Marker({
          element: createMarkerElement(STORE_MARKER_COLOR, { active: isSelected }),
          anchor: "center",
        })
          .setLngLat(store.coordinates)
          .addTo(map)

        markersRef.current.push(marker)
      })

      if (userLocation && !isUserAtSelectedStore) {
        const userMarker = new mapboxgl.Marker({
          element: createMarkerElement("#f97316"),
          anchor: "center",
        })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map)

        markersRef.current.push(userMarker)

        const [destLng, destLat] = selected.coordinates
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
        const geometry =
          (await fetchRouteGeometry(
            [userLocation.lng, userLocation.lat],
            [destLng, destLat],
            token
          )) ?? {
            type: "LineString" as const,
            coordinates: [
              [userLocation.lng, userLocation.lat],
              [destLng, destLat],
            ],
          }

        upsertRouteLayer(map, geometry)

        const bounds = new mapboxgl.LngLatBounds()
        bounds.extend([userLocation.lng, userLocation.lat])
        bounds.extend([destLng, destLat])
        map.fitBounds(bounds, { padding: 72, maxZoom: 14, duration: 600 })
      } else {
        removeRouteLayer(map)
        const [lng, lat] = selected.coordinates
        map.flyTo({ center: [lng, lat], zoom: 15, duration: 600 })
      }
    }

    void renderMarkersAndRoute()
  }, [hasToken, mapReady, stores, selected, userLocation, isUserAtSelectedStore])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !containerRef.current) return

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current)
    return () => resizeObserver.disconnect()
  }, [hasToken])

  if (!hasToken) {
    return (
      <GoogleMapFallback
        selected={selected}
        userLocation={userLocation}
        isUserAtSelectedStore={isUserAtSelectedStore}
      />
    )
  }

  return <div ref={containerRef} className={cn("h-full w-full")} />
}
