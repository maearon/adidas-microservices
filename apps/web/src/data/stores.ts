import { Store } from "@/types/store";
import { calculateDistance } from "@/utils/distance";

export const PRIMARY_STORE_ID = "store-001";

export const stores: Store[] = [
  {
    id: 'store-001',
    name: 'adidas Flagship Store Hòa Bình',
    address: '565 5th Ave',
    city: 'New York',
    distance: 2.86,
    coordinates: [105.3442469, 20.8187307], // longitude, latitude
    hours: {
      Monday: '10:00 AM - 08:00 PM',
      Tuesday: '10:00 AM - 08:00 PM',
      Wednesday: '10:00 AM - 08:00 PM',
      Thursday: '10:00 AM - 08:00 PM',
      Friday: '10:00 AM - 08:00 PM',
      Saturday: '10:00 AM - 08:00 PM',
      Sunday: '11:00 AM - 07:00 PM',
    },
    phone: '+84 (912) 915-132',
    features: ['click and collect', 'endless aisle', 'gift cards'],
  },
  {
    id: 'store-002',
    name: 'Originals Flagship Store Hòa Bình, Spring Street',
    address: '115 Spring Street',
    city: 'New York',
    distance: 3.42,
    coordinates: [105.3346060, 20.8686532], // longitude, latitude
    hours: {
      Monday: '10:00 AM - 07:00 PM',
      Tuesday: '10:00 AM - 07:00 PM',
      Wednesday: '10:00 AM - 07:00 PM',
      Thursday: '10:00 AM - 07:00 PM',
      Friday: '10:00 AM - 08:00 PM',
      Saturday: '10:00 AM - 08:00 PM',
      Sunday: '11:00 AM - 07:00 PM',
    },
    phone: '+84 (974) 006-807',
    features: ['click and collect', 'endless aisle', 'gift cards'],
  },
];

export const PRIMARY_STORE =
  stores.find((store) => store.id === PRIMARY_STORE_ID) ?? stores[0];

export function sortStoresForDisplay(
  storeList: Store[],
  userLocation: { lat: number; lng: number } | null
): Store[] {
  const primary = storeList.find((store) => store.id === PRIMARY_STORE_ID);
  const others = storeList.filter((store) => store.id !== PRIMARY_STORE_ID);

  if (!userLocation) {
    return primary ? [primary, ...others] : storeList;
  }

  const sortByDistance = (a: Store, b: Store) => {
    const distanceA = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      a.coordinates[1],
      a.coordinates[0]
    );
    const distanceB = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      b.coordinates[1],
      b.coordinates[0]
    );
    return distanceA - distanceB;
  };

  return [...storeList].sort(sortByDistance);
}
