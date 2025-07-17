// locale.client.ts — chỉ dùng ở client
export function getLocaleFromClient() {
  if (typeof document === "undefined") return "en-US"
  const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
  return match?.[1] ?? "en-US"
}
