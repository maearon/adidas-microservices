import { cn } from "@/lib/utils"

type SocialBrandIconProps = {
  className?: string
}

const iconClass = "h-5 w-5 shrink-0"

export function FacebookIcon({ className }: SocialBrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(iconClass, className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M20.9 2H3.1A1.1 1.1 0 0 0 2 3.1v17.8A1.1 1.1 0 0 0 3.1 22h9.58v-7.75h-2.6v-3h2.6V9a3.64 3.64 0 0 1 3.88-4a20 20 0 0 1 2.33.12v2.7H17.3c-1.26 0-1.5.6-1.5 1.47v1.93h3l-.39 3H15.8V22h5.1a1.1 1.1 0 0 0 1.1-1.1V3.1A1.1 1.1 0 0 0 20.9 2"
      />
    </svg>
  )
}

export function YahooIcon({ className }: SocialBrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(iconClass, className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M10.5 7.59L8.16 13.2L5.85 7.59H2l4.29 9.64l-1.54 3.47H8.5l5.74-13.11zm4.5 5.14c-1.37 0-2.41 1.04-2.41 2.27c0 1.17 1 2.16 2.34 2.16c1.39 0 2.43-1.03 2.43-2.26c0-1.21-1-2.17-2.36-2.17m2.72-9.43l-3.83 8.59h4.28L22 3.3z"
      />
    </svg>
  )
}

export function AppleIcon({ className }: SocialBrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(iconClass, className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35c-1.09-.46-2.09-.48-3.24 0c-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8c1.18-.24 2.31-.93 3.57-.84c1.51.12 2.65.72 3.4 1.8c-3.12 1.87-2.38 5.98.48 7.13c-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25c.29 2.58-2.34 4.5-3.74 4.25"
      />
    </svg>
  )
}

export function GoogleIcon({ className }: SocialBrandIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn(iconClass, className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M3.064 7.51A10 10 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9s.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49"
      />
    </svg>
  )
}

export type SocialBrandIconId = "facebook" | "yahoo" | "apple" | "google"

const SOCIAL_ICON_MAP = {
  facebook: FacebookIcon,
  yahoo: YahooIcon,
  apple: AppleIcon,
  google: GoogleIcon,
} as const

export function SocialBrandIcon({
  id,
  className,
}: {
  id: SocialBrandIconId
  className?: string
}) {
  const Icon = SOCIAL_ICON_MAP[id]
  return <Icon className={className} />
}
