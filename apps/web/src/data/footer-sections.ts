// Structured footer data with stable keys for translations
// Keys are chosen to align with existing namespaces: footer and megaMenu

export type FooterItem = {
  key: string
  href: string
  fallback: string
}

export type FooterSection = {
  sectionKey: string
  items: FooterItem[]
}

export const footerSectionsData: FooterSection[] = [
  {
    sectionKey: "products",
    items: [
      { key: "shoes", href: "/shoes", fallback: "Shoes" },
      { key: "clothing", href: "/clothing", fallback: "Clothing" },
      { key: "accessories", href: "/accessories", fallback: "Accessories" },
      { key: "giftCards", href: "/gift-cards", fallback: "Gift Cards" },
      { key: "newArrivals", href: "/new-arrivals", fallback: "New Arrivals" },
      { key: "bestSellers", href: "/best-sellers", fallback: "Best Sellers" },
      { key: "releaseDates", href: "/release-dates", fallback: "Release Dates" },
      { key: "sale", href: "/sale", fallback: "Sale" },
    ],
  },
  {
    sectionKey: "sports",
    items: [
      { key: "soccer", href: "/sports/soccer", fallback: "Soccer" },
      { key: "running", href: "/sports/running", fallback: "Running" },
      { key: "basketball", href: "/sports/basketball", fallback: "Basketball" },
      { key: "football", href: "/sports/football", fallback: "Football" },
      { key: "outdoor", href: "/sports/outdoor", fallback: "Outdoor" },
      { key: "golf", href: "/sports/golf", fallback: "Golf" },
      { key: "baseball", href: "/sports/baseball", fallback: "Baseball" },
      { key: "tennis", href: "/sports/tennis", fallback: "Tennis" },
      { key: "skateboarding", href: "/sports/skateboarding", fallback: "Skateboarding" },
      { key: "training", href: "/sports/training", fallback: "Training" },
    ],
  },
  {
    sectionKey: "collections",
    items: [
      { key: "adicolor", href: "/collections/adicolor", fallback: "adicolor" },
      { key: "ultraboost", href: "/collections/ultraboost", fallback: "Ultraboost" },
      { key: "forum", href: "/collections/forum", fallback: "Forum" },
      { key: "superstar", href: "/collections/superstar", fallback: "Superstar" },
      { key: "runningShoes", href: "/collections/running-shoes", fallback: "Running Shoes" },
      { key: "adilette", href: "/collections/adilette", fallback: "adilette" },
      { key: "stanSmith", href: "/collections/stan-smith", fallback: "Stan Smith" },
      { key: "adizero", href: "/collections/adizero", fallback: "adizero" },
      { key: "tiro", href: "/collections/tiro", fallback: "Tiro" },
      { key: "cloudfoamPure", href: "/collections/cloudfoam-pure", fallback: "Cloudfoam Pure" },
    ],
  },
  {
    sectionKey: "support",
    items: [
      { key: "help", href: "/help", fallback: "Help" },
      { key: "returnsExchanges", href: "/help/returns", fallback: "Returns & Exchanges" },
      { key: "shipping", href: "/help/shipping", fallback: "Shipping" },
      { key: "orderTracker", href: "/order-tracker", fallback: "Order Tracker" },
      { key: "storeLocator", href: "/stores", fallback: "Store Locator" },
      { key: "sizeCharts", href: "/help/size-charts", fallback: "Size Charts" },
      { key: "giftCardBalance", href: "/gift-cards/balance", fallback: "Gift Card Balance" },
      { key: "howToCleanShoes", href: "/help/clean-shoes", fallback: "How to Clean Shoes" },
      { key: "braFitGuide", href: "/help/bra-fit-guide", fallback: "Bra Fit Guide" },
      { key: "breathingForRunning", href: "/help/breathing-for-running", fallback: "Breathing for Running" },
      { key: "promotions", href: "/help/promotions", fallback: "Promotions" },
      { key: "sitemap", href: "/sitemap", fallback: "Sitemap" },
    ],
  },
  {
    sectionKey: "companyInfo",
    items: [
      { key: "aboutUs", href: "/about", fallback: "About Us" },
      { key: "studentDiscount", href: "/discounts/student", fallback: "Student Discount" },
      { key: "militaryHealthcareDiscount", href: "/discounts/military-healthcare", fallback: "Military & Healthcare Discount" },
      { key: "adidasStories", href: "/stories", fallback: "adidas Stories" },
      { key: "adidasApps", href: "/apps", fallback: "adidas Apps" },
      { key: "impact", href: "/impact", fallback: "Impact" },
      { key: "people", href: "/impact/people", fallback: "People" },
      { key: "planet", href: "/impact/planet", fallback: "Planet" },
      { key: "adiClub", href: "/adiclub", fallback: "adiClub" },
      { key: "affiliates", href: "/affiliates", fallback: "Affiliates" },
      { key: "press", href: "/press", fallback: "Press" },
      { key: "careers", href: "/careers", fallback: "Careers" },
      { key: "californiaTransparencyInSupplyChainsAct", href: "/legal/california-supply-chains", fallback: "California Transparency in Supply Chains Act" },
      { key: "responsibleDisclosure", href: "/legal/responsible-disclosure", fallback: "Responsible Disclosure" },
      { key: "transparencyInCoverage", href: "/legal/transparency-in-coverage", fallback: "Transparency in Coverage" },
    ],
  },
]

export const mobileFooterSectionsData: FooterSection[] = [
  {
    sectionKey: "myAccount",
    items: [
      { key: "help", href: "/help", fallback: "Help" },
      { key: "returnsExchanges", href: "/help/returns", fallback: "Returns & Exchanges" },
      { key: "orderTracker", href: "/order-tracker", fallback: "Order Tracker" },
      { key: "shipping", href: "/help/shipping", fallback: "Shipping" },
      { key: "promotions", href: "/help/promotions", fallback: "Promotions" },
      { key: "sitemap", href: "/sitemap", fallback: "Sitemap" },
    ],
  },
  {
    sectionKey: "yourBag",
    items: [
      { key: "adiClub", href: "/adiclub", fallback: "adiClub" },
      { key: "storeLocator", href: "/stores", fallback: "Store Finder" },
      { key: "giftCards", href: "/gift-cards", fallback: "Gift Cards" },
      { key: "adidasApps", href: "/apps", fallback: "adidas Apps" },
      { key: "sizeCharts", href: "/help/size-charts", fallback: "Size Charts" },
    ],
  },
]
