import Image from "next/image"
import { useTranslations } from "@/hooks/useTranslations"

const PromoSection = () => { 
  const t = useTranslations("auth");
  return (
    <div className="space-y-6">
      <div className="bg-background md:p-8 p-1 rounded-none">
        <Image
          src="/assets/login/account-portal-page-inline.png"
          alt="Adiclub Benefits"
          width={600}
          height={600}
          className="w-full h-auto object-cover mb-6 rounded-none"
        />
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
            <span className="text-background font-bold text-xl">a</span>
          </div>
          <h2 className="text-2xl font-bold">{t?.joinAdiclubGetDiscount || "JOIN ADICLUB. GET A 15% DISCOUNT."}</h2>
        </div>
        <p className="text-gray-600 dark:text-white mb-6">
          {t?.asAdiclubMember || "As an adiClub member you get rewarded with what you love for doing what you love. Sign up today and receive immediate access to these Level 1 benefits:"}
        </p>
        <ul className="space-y-2 text-base">
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t?.freeShipping || "Free shipping"}</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t?.fifteenPercentVoucher || "A 15% off voucher"}</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t?.membersOnlySales || "Members Only sales"}</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t?.accessAdidasApps || "Access to adidas apps"}</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t?.specialPromotions || "Special promotions"}</li>
        </ul>
      </div>
    </div>
  )
}

export default PromoSection
