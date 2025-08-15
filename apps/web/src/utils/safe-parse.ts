// utils/safe-parse.ts
export function safeParseResponse<T extends object>(
  data: unknown,
  fallback: Partial<T> = {},
  errorLabel = "Invalid API response"
): T {
  if (typeof data !== "object" || data === null) {
    console.warn(`${errorLabel}: data is not an object`, data)
    return fallback as T
  }

  const cleaned: Record<string, unknown> = { ...fallback }

  for (const key in data as object) {
    const value = (data as Record<string, unknown>)[key]
    try {
      // Nếu là object lồng, parse sâu 1 mức
      if (typeof value === "object" && value !== null) {
        cleaned[key] = JSON.parse(JSON.stringify(value)) // đảm bảo không có circular
      } else {
        cleaned[key] = value
      }
    } catch (e) {
      console.warn(`Invalid key in ${errorLabel}: ${key}`, e)
    }
  }

  return cleaned as T
}
