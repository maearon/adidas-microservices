"use client";

import { LogIn } from "lucide-react";
import Link from "next/link";

const SignInButton = () => {
  return (
    <Link href="/sign-in">
      <LogIn className="h-5 w-5" />
    </Link>
  );
};

export default SignInButton;
