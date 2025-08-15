export type Store = {
  id: string
  name: string
  address: string
  city: string
  distance: number
  coordinates: [number, number]
  hours: Record<string, string>
  phone: string
  features: string[]
}
