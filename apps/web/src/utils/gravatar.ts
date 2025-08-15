import md5 from 'blueimp-md5'

export const getGravatarUrl = (
  email?: string, 
  fallbackUrl = "/avatar-placeholder.png", 
  fallbackEmail = "default@example.com"
) => {
  if (!email) return fallbackUrl
  const finalEmail = email?.trim().toLowerCase() || fallbackEmail
  const hash = md5(finalEmail.trim().toLowerCase())
  return `https://secure.gravatar.com/avatar/${hash}?s=${50}`
}
