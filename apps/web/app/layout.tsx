import type React from "react"
import type { Metadata } from "next"
import { Barlow } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ChatWidget from "@/components/chat-widget"
import { 
  // FeedbackModalProvider, 
  LocationModalProvider 
} from "@/components/modal-providers"
import FeedbackWidget from "@/components/feedback-widget"
import ScrollToTop from "@/components/scroll-to-top"
import { AuthProvider } from "@/context/AuthContext"
import { GoogleOAuthProvider } from "@react-oauth/google"
import ReactQueryProvider from "./ReactQueryProvider"
import RedirectListener from "@/components/RedirectListener" // ✅ THÊM DÒNG NÀY
import { ToastContainer } from "react-toastify"
import MaintenancePage from "@/_components/MaintenancePage"
import { Toaster } from "@/components/ui/toaster"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "adidas Online Shop | adidas US",
  description: "Shop the latest adidas shoes, clothing and accessories",
}

const isMaintenance = false

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={barlow.className}>
        <GoogleOAuthProvider clientId={'588366578054-bqg4hntn2fts7ofqk0s19286tjddnp0v.apps.googleusercontent.com'}>
          <Providers>
            <AuthProvider>
              <ReactQueryProvider>
                <RedirectListener /> {/* ✅ THÊM VÀO BODY */}
                <Header />
                <ToastContainer position="top-right" autoClose={3000} />
                <main>{isMaintenance ? <MaintenancePage /> : children}</main>
                <Footer />
                <ChatWidget />
                <LocationModalProvider />
                <ChatWidget />
                <FeedbackWidget />
                <ScrollToTop />
              </ReactQueryProvider>
              <Toaster />
            </AuthProvider>
          </Providers>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
