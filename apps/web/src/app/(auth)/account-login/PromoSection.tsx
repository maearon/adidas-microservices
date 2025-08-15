import Image from "next/image"

const PromoSection = async () => { 
  return (
    <div className="space-y-6">
      <div className="bg-background md:p-8 p-1 rounded-none">
        <Image
          src="/assets/login/account-portal-page-inline.jpeg"
          alt="Adiclub Benefits"
          width={600}
          height={600}
          className="w-full h-auto object-cover mb-6 rounded-none"
        />
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-background font-bold text-xl">a</span>
          </div>
          <h2 className="text-2xl font-bold">JOIN ADICLUB TO UNLOCK MORE REWARDS</h2>
        </div>
        <p className="text-gray-600 dark:text-white mb-6">
          Join adiClub for free and enjoy immediate access to these Level 1 rewards:
        </p>
        <ul className="space-y-2 text-base">
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Welcome Bonus Voucher for 15% off</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Free Shipping and Returns</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Members-Only Products</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Early Access to Sales</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span>Access to Limited Editions</li>
        </ul>
        <p className="text-gray-600 dark:text-white mb-6">
          Start earning adiClub points every time you shop, track a run on the adidas Running app and share a product review.
          The more points you earn, the faster you&apos;ll level up and unlock rewards such as a Birthday Gift, Free Personalisation, Priority Customer Service, Premium Event Tickets and more.
        </p>
      </div>
    </div>
  )
}

export default PromoSection
