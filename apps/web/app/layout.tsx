'use client'

import type React from "react"
import type { Metadata } from "next"
import { Barlow } from "next/font/google"
import "./globals.css"
import 'mapbox-gl/dist/mapbox-gl.css'
import { Providers } from "@/components/providers"
import Navbar from "@/components/Navbar"
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
import { store } from "@/store/store"
import { fetchUser } from "@/store/sessionSlice"
import { Provider } from "react-redux"

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

// export const metadata: Metadata = {
//   title: {
//     template: "adidas %s | adidas US",
//     default: "adidas Online Shop | adidas US",
//   },
//   description: "Shop the latest adidas shoes, clothing and accessories",
// }

const isMaintenance = false

store.dispatch(fetchUser())

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={barlow.className}>
        <GoogleOAuthProvider clientId={'588366578054-bqg4hntn2fts7ofqk0s19286tjddnp0v.apps.googleusercontent.com'}>
          <Provider store={store}>
            <AuthProvider>
              <ReactQueryProvider>
                <RedirectListener /> {/* ✅ THÊM VÀO BODY */}
                <Navbar />
                <ToastContainer
                  position="bottom-right"
                  autoClose={4000}
                  hideProgressBar={false}
                />
                <main>{isMaintenance ? <MaintenancePage /> : children}</main>
                <Footer />
                <LocationModalProvider />
                <ChatWidget />
                <FeedbackWidget />
                <ScrollToTop />
              </ReactQueryProvider>
              <Toaster />
            </AuthProvider>
          </Provider>
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
