'use client'

/**
 * Social login brand icons — inline SVGs in @/components/auth/social-brand-icons
 * Source paths: /public/icons/ (Iconify Simple Icons / MDI)
 */

import LoadingButton from "@/components/ui/LoadingButton"
import { SocialBrandIcon, type SocialBrandIconId } from "@/components/auth/social-brand-icons"
import { useState } from "react"
import { authClient, type ProviderId } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { useLoginMutationBetterAuthSessionSameSite } from "@/api/hooks/useLoginMutation"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store/store"
import { fetchUser } from "@/store/sessionSlice"
import flashMessage from "@/components/shared/flashMessages"

type ExtendedProviderId = ProviderId | "yahoo" | "apple"

type SocialProvider = {
  id: ExtendedProviderId
  label: string
  iconId: SocialBrandIconId
  enabled: boolean
}

const SOCIAL_BUTTON_CLASS =
  "border-black bg-white text-black hover:bg-white hover:text-black dark:border-white dark:bg-black dark:text-white dark:hover:bg-black dark:hover:text-white"

const providers: SocialProvider[] = [
  {
    id: "facebook",
    label: "Facebook",
    iconId: "facebook",
    enabled: true,
  },
  {
    id: "yahoo",
    label: "Yahoo",
    iconId: "yahoo",
    enabled: false,
  },
  {
    id: "apple",
    label: "Apple",
    iconId: "apple",
    enabled: false,
  },
  {
    id: "google",
    label: "Google",
    iconId: "google",
    enabled: true,
  },
]

type SocialLoginButtonsProps = {
  callbackURL?: string
}

const SocialLoginButtons = ({ callbackURL = "/" }: SocialLoginButtonsProps) => {
  const [socialLoading, setSocialLoading] = useState<ExtendedProviderId | null>(null)
  const dispatch = useDispatch<AppDispatch>()
  const loginMutation = useLoginMutationBetterAuthSessionSameSite()
  const router = useRouter()

  const handleLogin = async (provider: SocialProvider) => {
    if (!provider.enabled) {
      flashMessage("error", `${provider.label} login is not available yet.`)
      return
    }

    setSocialLoading(provider.id)

    try {
      const { error } = await authClient.signIn.social({
        provider: provider.id as ProviderId,
        callbackURL,
      })

      if (error) {
        flashMessage("error", error.message || "Social login failed")
        setSocialLoading(null)
        return
      }

      loginMutation.mutate(
        { keepLoggedIn: true },
        {
          onSuccess: async () => {
            await dispatch(fetchUser())
            router.push(callbackURL)
          },
          onSettled: () => setSocialLoading(null),
        },
      )
    } catch {
      flashMessage("error", "Social login failed")
      setSocialLoading(null)
    }
  }

  return (
    <div className="mb-3 flex gap-2">
      {providers.map((provider) => (
        <LoadingButton
          key={provider.id}
          variant="outline"
          size="icon"
          aria-label={`Continue with ${provider.label}`}
          className={cn(
            "social-button h-11 w-11 shrink-0 rounded-none border p-0",
            SOCIAL_BUTTON_CLASS,
            socialLoading === provider.id && "opacity-70",
          )}
          onClick={() => handleLogin(provider)}
          loading={socialLoading === provider.id}
        >
          <span className="flex h-full w-full items-center justify-center">
            <SocialBrandIcon id={provider.iconId} />
          </span>
        </LoadingButton>
      ))}
    </div>
  )
}

export default SocialLoginButtons
