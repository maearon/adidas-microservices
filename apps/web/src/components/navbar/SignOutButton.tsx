"use client";

import { useLogout } from "@/api/hooks/useLoginMutation"
import { LogOut } from "lucide-react";

const SignInButton = () => {
  const logoutHandler = useLogout() 

  return (
    <button onClick={logoutHandler}>
      <LogOut className="h-5 w-5" />
    </button>
  );
};

export default SignInButton;
