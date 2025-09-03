"use client"

import { useTranslations } from "@/hooks/useTranslations";
import Link from "next/link";

interface SignupPageClientProps {
  isLoggedIn: boolean;
}

export default function SignupPageClient({ isLoggedIn }: SignupPageClientProps) {
  const t = useTranslations("auth");

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t?.alreadyLoggedIn || "You're already logged in"}</h1>
          <Link href="/my-account" className="underline text-blue-600">
            {t?.goToMyAccount || "Go to My Account"}
          </Link>
        </div>
      </div>
    )
  }

  return null;
}
