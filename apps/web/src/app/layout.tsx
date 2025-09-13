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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${barlow.variable}`}
      >
        <ReduxProvider>
          <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
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
