"use client";

import { LogIn } from "lucide-react";
import { openLoginModal } from "@/lib/auth-navigation";

const SignInButton = () => {
  return (
    <button type="button" onClick={openLoginModal} aria-label="Log in">
      <LogIn className="h-5 w-5" />
    </button>
  );
};

export default SignInButton;
