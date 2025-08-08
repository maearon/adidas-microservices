'use client'

import Image from 'next/image'

interface Resource {
  title: string,
  subtitle?: string,
  description?: string,
  image?: string,
  href?: string,
  cta?: string,
}

interface ResourceCardProps {
  resource: Resource,
  index: number
}

export default function ResourceCard({
  resource = {
    title: "",
    subtitle: "",
    description: "",
    image: "/placeholder.png",
    href: "#",
    cta: "SHOP NOW",
  },
  index = 1
}: ResourceCardProps) {
  return (
    <a
      key={`${resource.title}-${index}`}
      href={resource.href}
      className="group flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md transition duration-300"
    >
      <div className="relative w-full h-60 overflow-hidden rounded-none">
        <Image
          src={resource.image || '/placeholder.png'}
          alt={resource.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
      </div>
      <div className="mt-4">
        <h3 className="font-bold text-base sm:text-lg leading-tight">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-base text-foreground/70 mt-1 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>
    </a>
  )
}
