import { Store } from "@/types/store"
import { calculateDistance } from "@/utils/distance"

export const STORE_LOCATION_MATCH_KM = 0.2

export function findStoreAtLocation(
  latitude: number,
  longitude: number,
  storeList: Store[]
): Store | null {
  let closest: Store | null = null
  let closestDistance = STORE_LOCATION_MATCH_KM

  for (const store of storeList) {
    const distance = calculateDistance(
      latitude,
      longitude,
      store.coordinates[1],
      store.coordinates[0]
    )

    if (distance <= closestDistance) {
      closest = store
      closestDistance = distance
    }
  }

  return closest
}

export function findNearestStore(
  latitude: number,
  longitude: number,
  storeList: Store[]
): Store {
  return storeList.reduce((prev, curr) => {
    const prevDistance = calculateDistance(
      latitude,
      longitude,
      prev.coordinates[1],
      prev.coordinates[0]
    )
    const currDistance = calculateDistance(
      latitude,
      longitude,
      curr.coordinates[1],
      curr.coordinates[0]
    )
    return currDistance < prevDistance ? curr : prev
  })
}
