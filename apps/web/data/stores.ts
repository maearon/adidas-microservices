import { Store } from "@/types/store";

export const stores: Store[] = [
  {
    id: 'store-001',
    name: 'adidas Flagship Store New York',
    address: '565 5th Ave',
    city: 'New York',
    distance: 2.86,
    coordinates: [-73.974187, 40.756795],
    hours: {
      Monday: '10:00 AM - 08:00 PM',
      Tuesday: '10:00 AM - 08:00 PM',
      Wednesday: '10:00 AM - 08:00 PM',
      Thursday: '10:00 AM - 08:00 PM',
      Friday: '10:00 AM - 08:00 PM',
      Saturday: '10:00 AM - 08:00 PM',
      Sunday: '11:00 AM - 07:00 PM',
    },
    phone: '+1 (212) 123-4567',
    features: ['click and collect', 'endless aisle', 'gift cards'],
  },
  {
    id: 'store-002',
    name: 'Originals Flagship Store New York, Spring Street',
    address: '115 Spring Street',
    city: 'New York',
    distance: 3.42,
    coordinates: [-74.000263, 40.723007],
    hours: {
      Monday: '10:00 AM - 07:00 PM',
      Tuesday: '10:00 AM - 07:00 PM',
      Wednesday: '10:00 AM - 07:00 PM',
      Thursday: '10:00 AM - 07:00 PM',
      Friday: '10:00 AM - 08:00 PM',
      Saturday: '10:00 AM - 08:00 PM',
      Sunday: '11:00 AM - 07:00 PM',
    },
    phone: '+1 (212) 966-0954',
    features: ['click and collect', 'endless aisle', 'gift cards'],
  },
]
