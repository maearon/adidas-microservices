import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { forbidden, redirect, unauthorized } from "next/navigation";


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Email Verified",
    description: "Shop the latest kids' shoes, clothing, and accessories at adidas US.",
  };
}

export default async function EmailVerifiedPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) redirect("/sign-in");

  if (user.emailVerified) redirect("/my-account");

  // const t = useTranslations("account")

  return (
    <main className="flex flex-1 items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Email verified</h1>
          <p className="text-muted-foreground">
            Your email has been verified successfully.
          </p>
        </div>
        <Button 
          border 
          href="/my-account"
          theme="black" 
          shadow={true} 
          pressEffect={true}>
            {/* {t?.visitYourAccount || "Go to Dashboard"} */}
            Go to Dashboard
        </Button>
      </div>
    </main>
  );
}
