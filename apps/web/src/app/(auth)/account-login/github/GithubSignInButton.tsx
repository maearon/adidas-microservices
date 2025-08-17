import { BaseButton } from "@/components/ui/base-button";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function GithubSignInButton() {
  return (
    <BaseButton
      variant="outline"  
      className="bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 hover:text-background border border-border rounded-full"
      asChild
    >
      <Link href="/account-login/github" className="flex w-full items-center gap-2">
        <GithubIcon />
        Log in with Github
      </Link>
    </BaseButton>
  );
}

function GithubIcon() {
  return (
    <FaGithub />
  );
}
