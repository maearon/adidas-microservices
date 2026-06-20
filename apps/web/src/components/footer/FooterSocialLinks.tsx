import Image from "next/image"
import { FOOTER_SOCIAL_LINKS } from "@/components/footer/footer-social-icons"

type FooterSocialLinksProps = {
  className?: string
}

/** adidas.com footer — 32px white icons from /public/icons/social/ */
export default function FooterSocialLinks({ className }: FooterSocialLinksProps) {
  return (
    <ul className={className}>
      {FOOTER_SOCIAL_LINKS.map(({ name, href, iconSrc }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="inline-flex transition-opacity hover:opacity-70"
          >
            <Image
              src={iconSrc}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
