import LoginForm from "./LoginForm"
import PromoSection from "./PromoSection"
import { Suspense } from "react"
import { authPageClass } from "@/components/auth/adiclub-auth-styles"

const LoginPage = () => {
  return (
    <div className={authPageClass}>
      <div className="mx-auto w-full px-3 pb-0 pt-2 sm:px-20 sm:pt-14 lg:px-28 lg:pb-1 lg:pt-16 xl:px-32">
        <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
          <div className="w-full lg:w-1/2">
            <PromoSection />
          </div>
          <div className="w-full lg:w-1/2">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
