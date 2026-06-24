'use client'

import { useEffect, useMemo, useState } from 'react'
import { LocateFixed } from 'lucide-react'

import StoreList from '@/components/store/StoreList'
import StoreMap from '@/components/store/StoreMap'
import StoreDetail from '@/components/store/StoreDetail'
import {
  PRIMARY_STORE,
  sortStoresForDisplay,
  stores,
} from '@/data/stores'
import { Store } from '@/types/store'
import { useTranslations } from '@/hooks/useTranslations'
import { useAppSelector } from '@/store/hooks'
import { selectLocale } from '@/store/localeSlice'
import type { SupportedLocale } from '@/lib/constants/localeOptions'
import { reverseGeocodeAddress } from '@/utils/reverse-geocode'
import {
  findNearestStore,
  findStoreAtLocation,
} from '@/utils/store-location'
import { cn } from '@/lib/utils'

export default function StoreFinderPage() {
  const t = useTranslations('stores') as Record<string, string | undefined>
  const locale = (useAppSelector(selectLocale) as SupportedLocale) || 'en_US'

  const [selectedStore, setSelectedStore] = useState<Store>(PRIMARY_STORE)
  const [search, setSearch] = useState('')
  const [searchFromLocation, setSearchFromLocation] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [userLocation, setUserLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')

  const storesWithDistance = sortStoresForDisplay(stores, userLocation)

  const filteredStores = useMemo(() => {
    if (search.trim() === '' || searchFromLocation) {
      return storesWithDistance
    }

    const keyword = normalize(search)
    return storesWithDistance.filter((store) => {
      return (
        normalize(store.name).includes(keyword) ||
        normalize(store.address).includes(keyword) ||
        normalize(store.city).includes(keyword)
      )
    })
  }, [search, searchFromLocation, storesWithDistance])

  const matchedStore = useMemo(() => {
    if (!userLocation) return null
    return findStoreAtLocation(userLocation.lat, userLocation.lng, stores)
  }, [userLocation])

  const isUserAtSelectedStore = matchedStore?.id === selectedStore.id

  const updateLocation = async (
    latitude: number,
    longitude: number,
    options?: { fillSearch?: boolean; selectNearest?: boolean }
  ) => {
    setUserLocation({ lat: latitude, lng: longitude })

    const storeAtLocation = findStoreAtLocation(latitude, longitude, stores)

    if (storeAtLocation) {
      setSelectedStore(storeAtLocation)
    } else if (options?.selectNearest) {
      setSelectedStore(findNearestStore(latitude, longitude, stores))
    }

    if (options?.fillSearch) {
      const address = await reverseGeocodeAddress(latitude, longitude, locale)
      setSearch(address)
      setSearchFromLocation(true)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported')
      return
    }

    setIsLocating(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await updateLocation(
          position.coords.latitude,
          position.coords.longitude,
          { fillSearch: true, selectNearest: true }
        )
        setIsLocating(false)
      },
      (error) => {
        console.error(error)
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        await updateLocation(
          position.coords.latitude,
          position.coords.longitude,
          { fillSearch: false, selectNearest: false }
        )
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const locationsLabel = (t.locationsCount || '{{count}} locations').replace(
    '{{count}}',
    String(filteredStores.length)
  )

  return (
    <div className="flex flex-col xl:h-[calc(100vh-64px)] xl:flex-row xl:overflow-hidden">
      <div className="relative order-1 h-[min(42vh,360px)] shrink-0 xl:order-2 xl:h-auto xl:min-h-0 xl:flex-1">
        <StoreMap
          stores={stores}
          selected={selectedStore}
          userLocation={userLocation}
          isUserAtSelectedStore={isUserAtSelectedStore}
        />
        <div className="absolute top-4 right-4 z-10 hidden w-full max-w-md rounded-lg bg-background shadow-lg xl:block">
          <StoreDetail store={selectedStore} userLocation={userLocation} />
        </div>
      </div>

      <div className="order-2 w-full overflow-y-auto border-r p-4 xl:order-1 xl:w-[320px] xl:shrink-0">
        <h2 className="mb-1 text-lg font-semibold">
          {t.storeFinder || 'STORE FINDER'}
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">{locationsLabel}</p>

        <div className="relative mb-4">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSearchFromLocation(false)
            }}
            className="w-full rounded border px-3 py-2 pr-10 text-sm"
            placeholder={t.searchPlaceholder || 'Search city, zip, or address'}
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLocating}
            aria-label="Use current location"
            className={cn(
              'absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center',
              'transition-opacity hover:opacity-70 disabled:opacity-50'
            )}
          >
            <LocateFixed
              className={cn('h-4 w-4', isLocating && 'animate-pulse')}
            />
          </button>
        </div>

        <StoreList
          stores={filteredStores}
          onSelect={setSelectedStore}
          selectedId={selectedStore.id}
          userLocation={userLocation}
        />
      </div>
    </div>
  )
}
