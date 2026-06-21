import Image from "next/image"

type AcceptedPaymentMethodsProps = {
  showTitle?: boolean
}

export function AcceptedPaymentMethods({ showTitle = false }: AcceptedPaymentMethodsProps) {
  return (
    <div className="mt-8">
      {showTitle ? (
        <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-foreground">
          Accepted payment methods
        </h3>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {[
          { src: "/assets/payment/download.svg", alt: "AmEx" },
          { src: "/assets/payment/download (1).svg", alt: "Discover" },
          { src: "/assets/payment/download (2).svg", alt: "Mastercard" },
          { src: "/assets/payment/download (3).svg", alt: "Visa" },
          { src: "/assets/payment/download (7).svg", alt: "Klarna" },
          { src: "/assets/payment/download (8).svg", alt: "Google Pay" },
          { src: "/assets/payment/download (9).svg", alt: "ADIDAS" },
          { src: "/assets/payment/download (10).svg", alt: "Shop Pay" },
          { src: "/assets/payment/download (11).svg", alt: "PayPal" },
          { src: "/assets/payment/download (12).svg", alt: "Afterpay" },
        ].map((item) => (
          <div
            key={item.alt}
            className="flex h-7 w-[46px] items-center justify-center bg-white dark:bg-neutral-900"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={42}
              height={18}
              className="max-h-[18px] object-contain dark:invert"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
