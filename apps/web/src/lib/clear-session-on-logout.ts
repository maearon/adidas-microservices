const PRESERVED_LOCAL_STORAGE_KEYS = ["lastVisitedProducts", "NEXT_LOCALE"] as const

/** Clear auth/session data on logout but keep user preferences like recently viewed. */
export function clearSessionOnLogout() {
  const preserved = PRESERVED_LOCAL_STORAGE_KEYS.reduce<Record<string, string>>((acc, key) => {
    const value = localStorage.getItem(key)
    if (value !== null) acc[key] = value
    return acc
  }, {})

  localStorage.clear()
  sessionStorage.clear()

  for (const [key, value] of Object.entries(preserved)) {
    localStorage.setItem(key, value)
  }

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim()
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })
}
