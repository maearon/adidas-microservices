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
  //     router.push("/sign-in")   // ✅ To login
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
          
  localStorage.clear();
  sessionStorage.clear();
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
window.location.reload();
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
