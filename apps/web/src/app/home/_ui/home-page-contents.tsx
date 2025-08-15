"use client";
import { LogMeOutButton } from "@/components/auth/LogMeOutButton";

export const HomePageContents = () => {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      This is the home page
      <LogMeOutButton/>
    </div>
  );
};
