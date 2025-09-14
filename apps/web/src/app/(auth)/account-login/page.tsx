import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import PromoSection from "./PromoSection";
import LoginPageClient from "./LoginPageClient";
import { getServerSession } from "@/lib/get-session";

const LoginPage = async () => {
  const session = await getServerSession()

  if (session?.user?.email) {
    return <LoginPageClient isLoggedIn={true} />
  }

  if(session) redirect('/');

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
