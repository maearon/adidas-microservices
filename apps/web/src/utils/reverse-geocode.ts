import type { SupportedLocale } from "@/lib/constants/localeOptions"

const localeLanguageMap: Record<SupportedLocale, string> = {
  en_US: "en",
  vi_VN: "vi",
}

function formatCoordinateFallback(latitude: number, longitude: number) {
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}

async function reverseGeocodeWithMapbox(
  latitude: number,
  longitude: number,
  language: string,
  token: string
) {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=${language}&access_token=${token}`
  )

  if (!response.ok) return null

  const data = await response.json()
  return (data.features?.[0]?.place_name as string | undefined) ?? null
}

async function reverseGeocodeWithBigDataCloud(
  latitude: number,
  longitude: number,
  language: string
) {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`
  )

  if (!response.ok) return null

  const data = await response.json()
  const parts = [
    data.locality,
    data.city,
    data.principalSubdivision,
    data.countryName,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(", ") : null
}

export async function reverseGeocodeAddress(
  latitude: number,
  longitude: number,
  locale: SupportedLocale = "en_US"
): Promise<string> {
  const language = localeLanguageMap[locale] ?? "en"
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (mapboxToken) {
    try {
      const mapboxAddress = await reverseGeocodeWithMapbox(
        latitude,
        longitude,
        language,
        mapboxToken
      )
      if (mapboxAddress) return mapboxAddress
    } catch {
      // fall through
    }
  }

  try {
    const cloudAddress = await reverseGeocodeWithBigDataCloud(
      latitude,
      longitude,
      language
    )
    if (cloudAddress) return cloudAddress
  } catch {
    // fall through
  }

  return formatCoordinateFallback(latitude, longitude)
}
