"use client";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const LoginButtons = () => {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const signinWithGithub = async () => {
    try {
      setLoadingProvider("github");
      await authClient.signIn.social({
        callbackURL: "/",
        provider: "github",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  const signinWithGoogle = async () => {
    try {
      setLoadingProvider("google");
      await authClient.signIn.social({
        callbackURL: "/",
        provider: "google",
      });
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        onClick={signinWithGoogle}
        border
        theme="black"
        showArrow={false}
        pressEffect
        shadow
        loading={loadingProvider === "google"}
        type="button"
        className="w-full py-3 font-semibold transition-colors"
      >
        Login with Google
        <FcGoogle />
      </Button>

      <Button
        onClick={signinWithGithub}
        border
        theme="black"
        showArrow={false}
        pressEffect
        shadow
        loading={loadingProvider === "github"}
        type="button"
        className="w-full py-3 font-semibold transition-colors"
      >
        Login with Github
        <FaGithub />
      </Button>
    </div>
  );
};
