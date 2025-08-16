// locale.client.ts — chỉ dùng ở client
export function getLocaleFromClient(): string {
  if (typeof window === "undefined") return "en_US"

  // Ưu tiên delivery-location (nếu đã chọn trước đó)
  // const deliveryLocale = localStorage.getItem("delivery-location")
  // if (deliveryLocale) return deliveryLocale

  // Nếu không có thì check NEXT_LOCALE trong localStorage
  const nextLocaleStorage = localStorage.getItem("NEXT_LOCALE")
  if (nextLocaleStorage) return nextLocaleStorage

  // Nếu vẫn không có thì check cookie NEXT_LOCALE
  const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
  if (match?.[1]) return match[1]

  // Fallback
  return "en_US"
}
