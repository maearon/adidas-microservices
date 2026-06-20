const ADIDAS_ASSETS_HOST = "https://brand.assets.adidas.com"

/** Extract asset filename from /image/upload/... or full CDN URL */
function extractAssetFileName(path: string): string {
  const normalized = path.replace(/^https?:\/\/[^/]+\/image\/upload\//, "")
  const segments = normalized.split("/")
  return segments[segments.length - 1] ?? normalized
}

/**
 * adidas.com serves menu spotlights via Cloudinary transforms sized to the slot (+ DPR).
 * Local /public copies scaled by CSS look blocky vs the same asset on brand.assets.adidas.com.
 */
export function adidasCdnImage(
  path: string,
  {
    width,
    height,
    dpr = 2,
  }: {
    width: number
    height: number
    dpr?: number
  },
): string {
  const fileName = extractAssetFileName(path)
  const w = Math.round(width * dpr)
  const h = Math.round(height * dpr)

  return `${ADIDAS_ASSETS_HOST}/image/upload/f_auto,q_auto,w_${w},h_${h},c_fill/${fileName}`
}
