import { BaseButton } from "@/components/ui/base-button";
import Link from "next/link";

export default function YahooSignInButton() {
  return (
    <BaseButton
      variant="outline"  
      className="bg-white text-black hover:bg-gray-100 hover:text-black border border-black rounded-full"
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
