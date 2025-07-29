// components/store/StoreMap.tsx
import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { Store } from '@/types/store';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

export default function StoreMap({ stores, selected }: { stores: Store[]; selected: Store }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: selected.coordinates,
      zoom: 13,
    })

    stores.forEach((store) => {
      new mapboxgl.Marker()
        .setLngLat(store.coordinates)
        .addTo(mapRef.current!)
    })
  }, [])

  useEffect(() => {
    mapRef.current?.flyTo({
      center: selected.coordinates,
      zoom: 14,
      speed: 1.2,
    })
  }, [selected])

  return <div ref={mapContainer} className="h-full w-full" />
}
