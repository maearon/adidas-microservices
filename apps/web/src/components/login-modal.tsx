"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AdidasCloseButton } from "@/components/ui/adidas-close-button"
import AdiclubAuthForm from "@/components/auth/AdiclubAuthForm"
import AdiclubLogo from "@/components/auth/AdiclubLogo"
import { authBodyClass } from "@/components/auth/adiclub-auth-styles"
import { useTranslations } from "@/hooks/useTranslations"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const t = useTranslations("auth")

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        hideCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="relative overflow-visible rounded-none bg-white p-0 dark:bg-black sm:max-w-md"
      >
        <AdidasCloseButton variant="corner" onClick={onClose} />
        <div className="max-h-[min(90dvh,640px)] overflow-x-hidden overflow-y-auto p-6 sm:p-8">
          <AdiclubLogo className="mb-6" />

          <h1 className="mb-2 origin-left scale-x-110 text-2xl font-bold uppercase text-foreground">
            {t?.logInOrSignUp ?? "LOG IN OR SIGN UP"}
          </h1>
          <p className={`mb-4 ${authBodyClass}`}>
            {t?.enjoyMembersOnly ??
              "Enjoy members-only access to exclusive products, experiences, offers and more."}
          </p>

          {isOpen ? (
            <AdiclubAuthForm
              redirectTo="/"
              onSuccess={onClose}
              showForgotPasswordLink={false}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
