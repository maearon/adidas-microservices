"use client";

// import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LogoutEverywhereButton() {
  const t = useTranslations("auth");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogoutEverywhere() {
    setLoading(true);
    const { error } = await authClient.revokeSessions();
    if (error) {
      toast.error(error.message || "Failed to log out everywhere");
      return;
    }
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
    router.refresh()
    setLoading(false);
  }

  return (
    // <LoadingButton
    //   variant="destructive"
    //   onClick={handleLogoutEverywhere}
    //   loading={loading}
    //   className="w-full"
    // >
    //   LOG ME OUT
    // </LoadingButton>
    <Button
      variant="destructive"
      onClick={handleLogoutEverywhere}
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
}
