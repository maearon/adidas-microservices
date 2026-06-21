"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { POST_LOGOUT_PATH } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import { clearSessionOnLogout } from "@/lib/clear-session-on-logout";
import { toast } from "sonner";

export const LogMeOutButton = () => {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleLogoutWithToLoginOrReload = async () => {
  //   try {
  //     clearTokens()
  //     await logoutHandler()           // 🟢 Gọi logout  
  //     flashMessage("success", "Logged out successfully")
  //     router.push("/sign-in")   // ✅ To login
  //   } catch (error) {
  //     flashMessage("error", "Logout failed")
  //   }
  // }

  const signout = async () => {
    setLoading(true);
    const { error } = await authClient.revokeSessions();
    if (error) {
      toast.error(error.message || "Failed to log out everywhere");
      return;
    }
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(POST_LOGOUT_PATH);
          router.refresh();
          clearSessionOnLogout();
          setTimeout(() => {
            window.location.href = POST_LOGOUT_PATH;
          }, 50);
        },
        onError: (err) => {
          console.error("Logout failed", err);
        },
      },
    });
    setLoading(false);
  };

  return (
    <Button
      onClick={signout}
      border
      theme="white"
      showArrow
      pressEffect={false}
      shadow={false}
      loading={loading}
      type="submit"
      className="w-full py-3 transition-colors"
    >
      {t?.signOut || "LOG ME OUT"}
    </Button>
  );
};
