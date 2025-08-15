"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const LogMeOutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleLogoutWithToLoginOrReload = async () => {
  //   try {
  //     clearTokens()
  //     await logoutHandler()           // 🟢 Gọi logout  
  //     flashMessage("success", "Logged out successfully")
  //     router.push("/account-login")   // ✅ To login
  //   } catch (error) {
  //     flashMessage("error", "Logout failed")
  //   }
  // }

  const signout = async () => {
    setLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
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
      className="w-full py-3 font-semibold transition-colors"
    >
      LOG ME OUT
    </Button>
  );
};
