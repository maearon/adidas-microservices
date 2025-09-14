"use client"

import { useState } from "react"
import { X, ChevronRight } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useAppSelector } from "@/store/hooks"
// import { selectUser } from "@/store/sessionSlice"
import Link from "next/link"
// import { useDispatch } from "react-redux"
// import type { AppDispatch } from "@/store/store"
// import flashMessage from "../shared/flashMessages"
// import { useLogout } from "@/api/hooks/useLoginMutation"
// import { useRouter } from "next/navigation"
// import { clearTokens } from "@/lib/token"
import { LogMeOutButton } from "@/components/auth/LogMeOutButton";
import { useTranslations } from "@/hooks/useTranslations"
import { LogoutEverywhereButton } from "@/app/(main)/profile/logout-everywhere-button";

interface UserAccountSlideOutProps {
  isOpen: boolean
  onClose: () => void
  user?: { name?: string, email?: string }
  // onLogout?: () => Promise<void>
}

export default function UserAccountSlideOut({ 
  isOpen, 
  onClose, 
  user, 
  // onLogout 
}: UserAccountSlideOutProps) {
  // const router = useRouter()
  const [activeTab, setActiveTab] = useState("JUST FOR YOU")
  const t = useTranslations("account")

  // Cho phép inject user từ props, fallback về Redux nếu không có
  // const userData = user || useAppSelector(selectUser)?.value || { name: undefined }

  // const dispatch = useDispatch<AppDispatch>()
  // const logoutHandler = useLogout()

  // const handleLogoutWithClose = async () => {
  //   try {
  //     clearTokens()
  //     await logoutHandler()
  //     flashMessage("success", "Logged out successfully")
  //     onClose()
  //     router.push("/sign-in")   // ✅ To login
  //   } catch (error) {
  //     flashMessage("error", "Logout failed")
  //   }
  // }

  const tabs = [
    t?.justForYou || "JUST FOR YOU", 
    t?.pointsShop || "POINTS SHOP", 
    t?.earnPoints || "EARN POINTS"
  ]

  const offers = [
    {
      title: t?.downloadAdidasApp || "Download the adidas app",
      description: t?.getAlertsForReleases || "Get alerts for releases, sales and member offers",
    },
    {
      title: t?.goForRunEarnPoints || "Go for a run and earn points",
      description: t?.downloadAdidasRunning || "Download adidas Running app and earn 2 points for every mile tracked",
    },
    {
      title: t?.getSpotifyPremium || "Get a Spotify Premium subscription",
      description: t?.redeemPointsSpotify || "Redeem your adiClub points to unlock up to 5 months of access to Spotify Premium",
    },
    {
      title: t?.earn10Discount || "Earn a $10 discount",
      description: t?.inviteFriend || "Invite a friend to adiClub and you both get $10 off",
    },
    {
      title: t?.onlyAtAdiClub || "Only at adiClub",
      description: t?.exclusiveProducts || "Exclusive products curated for members",
    },
    {
      title: t?.completeProfile || "Complete your profile",
      description: t?.tellUsMoreAboutYourself || "Tell us more about yourself to unlock personalized recommendations",
    },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.5)] z-40" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white dark:bg-black text-foreground shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold">{t?.hiMember || "HI"} {user?.name?.toUpperCase() || "MEMBER"}</h2>
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  <span className="text-base font-bold">adi</span>
                  <span className="text-base font-bold text-blue-600 italic">club</span>
                  <div className="ml-1 flex items-center">
                    <span className="text-xs">{t?.level || "LEVEL"}</span>
                    <span className="ml-1 text-2xl font-bold">1</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-black cursor-pointer rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <span className="text-base">{t?.pointsToSpend || "Points to spend"}</span>
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-2">
                  <span className="text-xs">0</span>
                </div>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-b">
            <Link
              href="/my-account"
              onClick={onClose}
              className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-black -mx-2 px-2 rounded"
            >
              <span className="font-medium">{t?.visitYourAccount || "VISIT YOUR ACCOUNT"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            {/* <button className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-black -mx-2 px-2 rounded w-full text-left">
              <span className="font-medium">POINTS HISTORY</span>
              <ChevronRight className="h-4 w-4" />
            </button> */}
            <Link
              href="/points-history"
              onClick={onClose}
              className="flex items-center justify-between py-3 hover:bg-gray-50 dark:hover:bg-black -mx-2 px-2 rounded"
            >
              <span className="font-medium">{t?.pointsHistory || "POINTS HISTORY"}</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-2 text-xs font-medium border-b-2 ${
                    activeTab === tab
                      ? "border-border text-black dark:text-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === (t?.justForYou || "JUST FOR YOU") && (
              <div className="p-6 space-y-4">
                {offers.map((offer, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-black cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-1">{offer.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-white">{offer.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === (t?.pointsShop || "POINTS SHOP") && (
              <div className="p-6 text-center">
                <p className="text-gray-500">{t?.noPointsShopItems || "No points shop items available"}</p>
              </div>
            )}

            {activeTab === (t?.earnPoints || "EARN POINTS") && (
              <div className="p-6 text-center">
                <p className="text-gray-500">{t?.waysToEarnPoints || "Ways to earn points coming soon"}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t">
            {/* <LogMeOutButton/> */}
            <LogoutEverywhereButton />
          </div>
        </div>
      </div>
    </>
  )
}
