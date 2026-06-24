export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 14) {
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
}

export function googleMapsDirectionsEmbedUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
) {
  return `https://www.google.com/maps?saddr=${originLat},${originLng}&daddr=${destLat},${destLng}&output=embed`
}
