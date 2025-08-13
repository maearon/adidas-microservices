import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import PromoSection from "./PromoSection";
import Link from "next/link";
import { getSession } from "@/lib/auth";

const LoginPage = async () => {
  const session = await getSession()

  if (session?.user?.email) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">You're already logged in</h1>
          <Link href="/my-account" className="underline text-blue-600">
            Go to My Account
          </Link>
        </div>
      </div>
    )
  }

  if(session) redirect('/home');

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-background md:py-8 pt-1 pb-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:gap-8 gap-2 items-start">
            {/* Left promo section */}
            <PromoSection />

            {/* Login Form section */}
            {/* https://react.dev/learn/sharing-state-between-components#lifting-state-up-by-example */}
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
