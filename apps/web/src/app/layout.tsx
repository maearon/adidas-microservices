import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationModalProvider } from "@/components/modal-providers";
import ChatWidget from "@/components/chat/ChatWidget";
import FeedbackWidget from "@/components/feedback-widget";
import ScrollToTop from "@/components/scroll-to-top";
import "mapbox-gl/dist/mapbox-gl.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import ReactQueryProvider from "./ReactQueryProvider";
import { cookies } from "next/headers";
import { SessionInitializer } from "./SessionInitializer";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: {
    template: "adidas %s | adidas US",
    default: "adidas Online Shop | adidas US",
  },
  description: "Shop the latest adidas shoes, clothing and accessories",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const theme = cookieStore.get("theme")?.value || "dark";
  return (
    <html lang={locale} className={theme} style={{ colorScheme: theme }} suppressHydrationWarning>
      <body
        className={`${barlow.variable}`}
      >
        <ReduxProvider>  
          <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SessionInitializer /> {/* ✅ client init session */}
            <Navbar />
              {children}
            <Footer />
            <LocationModalProvider />
            <ChatWidget />
            <FeedbackWidget />
            <ScrollToTop />
            <ToastProvider />
          </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};
