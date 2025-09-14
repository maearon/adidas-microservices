import React from "react"
import PromoSection from "./PromoSection"
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation"
import SignupForm from "./SignupForm"
import SignupPageClient from "./SignupPageClient"

const SignupPage = async () => {
  const session = await getServerSession()

  if (session?.user?.email) {
    return <SignupPageClient isLoggedIn={true} />
  }

  if(session) redirect('/');

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-background md:py-8 pt-1 pb-1">
        <div className="container mx-auto px-4">
          <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:gap-8 gap-2 items-start">
            {/* Left info box */}
            <PromoSection />

            {/* Signup form */}
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
