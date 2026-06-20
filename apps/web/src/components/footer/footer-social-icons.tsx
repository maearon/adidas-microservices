import type { SVGProps } from "react"

/** Brand SVG paths (Simple Icons, MIT) — monochrome 32×32 like adidas.com footer */
function SocialIconBase({
  children,
  label,
  ...props
}: SVGProps<SVGSVGElement> & { label: string }) {
  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-label={label}
      {...props}
    >
      {children}
    </svg>
  )
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="Facebook" {...props}>
      <path
        fill="currentColor"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </SocialIconBase>
  )
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="Instagram" {...props}>
      <path
        fill="currentColor"
        d="M7.0301 0.084c-1.2768 0.07035-2.1469 0.30864-2.9103 0.65912-0.78817 0.35815-1.4586 0.83762-2.1259 1.5049-0.66732 0.66732-1.1468 1.3378-1.5049 2.1259-0.35047 0.76344-0.58876 1.6335-0.65912 2.9103-0.07984 1.2652-0.09899 1.6677-0.09045 4.9101 0.008544 3.2424 0.027693 3.6449 0.09045 4.9101 0.07035 1.2768 0.30864 2.1469 0.65912 2.9103 0.35815 0.78817 0.83762 1.4586 1.5049 2.1259 0.66732 0.66732 1.3378 1.1468 2.1259 1.5049 0.76344 0.35047 1.6335 0.58876 2.9103 0.65912 1.2652 0.07984 1.6677 0.09899 4.9101 0.09045 3.2424-0.008544 3.6449-0.027693 4.9101-0.09045 1.2768-0.07035 2.1469-0.30864 2.9103-0.65912 0.78817-0.35815 1.4586-0.83762 2.1259-1.5049 0.66732-0.66732 1.1468-1.3378 1.5049-2.1259 0.35047-0.76344 0.58876-1.6335 0.65912-2.9103 0.07984-1.2652 0.09899-1.6677 0.09045-4.9101-0.008544-3.2424-0.027693-4.9101-0.09045-1.2768-0.07035-2.1469-0.30864-2.9103-0.65912-0.78817-0.35815-1.4586-0.83762-2.1259-1.5049-0.66732-0.66732-1.3378-1.1468-2.1259-1.5049-0.76344-0.35047-1.6335-0.58876-2.9103-0.65912-1.2652-0.07984-1.6677-0.09899-4.9101 0.008544-3.6449 0.027693-4.9101 0.09045zM12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"
      />
    </SocialIconBase>
  )
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="X" {...props}>
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932Zm-1.291 19.497h2.038L6.486 3.24H4.298l13.312 17.41Z"
      />
    </SocialIconBase>
  )
}

export function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="Pinterest" {...props}>
      <path
        fill="currentColor"
        d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"
      />
    </SocialIconBase>
  )
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="TikTok" {...props}>
      <path
        fill="currentColor"
        d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v10.74c0 4.96-3.51 9.08-8.8 9.94-6.14 1.05-11.22-3.67-11.22-9.5 0-1.08.16-2.12.47-3.1 1.04-3.32 3.99-5.76 7.57-6.34 1.17-.21 2.36-.2 3.52 0v4.31c-.87-.7-2.03-1.08-3.18-1.01-2.34.16-4.19 2.05-4.19 4.32 0 2.39 1.93 4.32 4.32 4.32 2.4 0 4.32-1.93 4.32-4.32V.02h3.53z"
      />
    </SocialIconBase>
  )
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <SocialIconBase label="YouTube" {...props}>
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </SocialIconBase>
  )
}

export const FOOTER_SOCIAL_LINKS = [
  { name: "Facebook", href: "https://www.facebook.com/adidas", Icon: FacebookIcon },
  { name: "Instagram", href: "https://www.instagram.com/adidas", Icon: InstagramIcon },
  { name: "X", href: "https://twitter.com/adidas", Icon: XIcon },
  { name: "Pinterest", href: "https://www.pinterest.com/adidas", Icon: PinterestIcon },
  { name: "TikTok", href: "https://www.tiktok.com/@adidas", Icon: TikTokIcon },
  { name: "YouTube", href: "https://www.youtube.com/adidas", Icon: YouTubeIcon },
] as const
