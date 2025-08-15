"use client";

import Image from "next/image";

import { authClient, ProviderId } from '@/lib/auth-client';
import { capitalizeTitle } from "@/utils/sanitizeMenuTitleOnly";

type ClientSafeProvider = {
  id: ProviderId;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const Icon = ({ provider }: { provider: ProviderId }) => {
  let imagePath = "";

  if (provider === "google") {
    imagePath = "/images/icons/google.svg";
  } else if (provider === "discord") {
    imagePath = "/images/icons/discord.svg";
  } else if (provider === "roblox") {
    imagePath = "/images/icons/auth0.svg";
  }

  return (
    <Image
      src={imagePath}
      width="25"
      height="25"
      alt="Google"
      className="mr-4"
    />
  );
};
export default function LoginButton({
  auth,
}: {
  auth: ClientSafeProvider | null;
}) {
  console.log("Auth: ", auth);
  const signinWithProvider = async () => {
    if (!auth) return; // đảm bảo không undefined
    await authClient.signIn.social({
      callbackURL: "/",
      provider: auth.id, // giờ chắc chắn có giá trị
    });
  };
  return (
    <button
      type="button"
      className="border shadow-1 rounded-md py-3 px-6 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={() => signinWithProvider()}
    >
      {auth ? (
        <div className="flex items-center">
          <Icon provider={auth.id} />
          Sign In with {capitalizeTitle(auth.id)}
        </div>
      ) : (
        "Custom Login Page"
      )}
    </button>
  );
}
