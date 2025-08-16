import type { Metadata } from "next";
import { Barlow, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/providers/redux-provider";
import { TRPCProvider } from "@/providers/trpc-provider";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationModalProvider } from "@/components/modal-providers";
import ChatWidget from "@/components/chat-widget";
import FeedbackWidget from "@/components/feedback-widget";
import ScrollToTop from "@/components/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
        className={`${barlow.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <TRPCProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
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
            </ThemeProvider>
          </TRPCProvider>
        </ReduxProvider>
      </body>
    </html>
  );
};
