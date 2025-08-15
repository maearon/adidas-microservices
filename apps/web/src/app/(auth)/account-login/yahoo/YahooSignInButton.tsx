import { BaseButton } from "@/components/ui/base-button";
import Link from "next/link";

export default function YahooSignInButton() {
  return (
    <BaseButton
      variant="outline"  
      className="bg-background text-background hover:bg-gray-100 hover:text-background border border-border rounded-full"
      asChild
    >
      <Link href="/account-login/yahoo" className="flex w-full items-center gap-2">
        <YahooIcon />
        Log in with Yahoo
      </Link>
    </BaseButton>
  );
}

function YahooIcon() {
  return (
    <span className="text-purple-600 font-bold text-lg">Y!</span>
  );
}
