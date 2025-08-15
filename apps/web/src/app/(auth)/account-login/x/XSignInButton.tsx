import { BaseButton } from "@/components/ui/base-button";
import Link from "next/link";

export default function XSignInButton() {
  return (
    <BaseButton
      variant="outline"  
      className="bg-background text-background hover:bg-gray-100 hover:text-background border border-border rounded-full"
      asChild
    >
      <Link href="/account-login/x" className="flex w-full items-center gap-2">
        <XIcon />
        Log in with X
      </Link>
    </BaseButton>
  );
}

function XIcon() {
  return (
    <svg
      width="21"
      className="fill-current"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
    </svg>
  );
}
