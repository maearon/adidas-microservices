import { capitalizeTitle } from "./sanitizeMenuTitleOnly"

export const getUiAvatarUrl = (
  name?: string, 
  fallbackUrl = "/avatar-placeholder.png", 
  fallbackName = "User Name"
) => {
  if (!name) return fallbackUrl
  const finalName = name?.trim().toLowerCase() || fallbackName
  const hash = capitalizeTitle(finalName.trim().toLowerCase())
  return `https://ui-avatars.com/api/?name=${hash}&background=000&color=fff`
}
