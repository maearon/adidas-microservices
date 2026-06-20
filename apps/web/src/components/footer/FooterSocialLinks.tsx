import { FOOTER_SOCIAL_LINKS } from "@/components/footer/footer-social-icons"

type FooterSocialLinksProps = {
  className?: string
}

/** adidas.com footer — white 32px icons, vertical stack, no circular badge */
export default function FooterSocialLinks({ className }: FooterSocialLinksProps) {
  return (
    <ul className={className}>
      {FOOTER_SOCIAL_LINKS.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="inline-flex text-white transition-opacity hover:opacity-70"
          >
            <Icon className="h-8 w-8 shrink-0" />
          </a>
        </li>
      ))}
    </ul>
  )
}
