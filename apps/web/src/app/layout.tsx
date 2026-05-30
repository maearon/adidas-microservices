import type { Metadata } from "next";
import { cookies } from "next/headers";
import Script from "next/script";
import { Barlow, Manrope } from "next/font/google";

import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { ReduxProvider } from "@/providers/redux-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { LocationModalProvider } from "@/components/modal-providers";
import { ToastProvider } from "@/components/ToastProvider";

import ChatWidget from "@/components/chat/ChatWidget";
import FeedbackWidget from "@/components/feedback-widget";
import ScrollToTop from "@/components/scroll-to-top";

import ReactQueryProvider from "./ReactQueryProvider";
import { SessionInitializer } from "./SessionInitializer";

// import Navbar from "@/components/navbar/Navbar";
// import Footer from "@/components/footer/Footer";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
  // Respect stored theme but don't force 'dark' as default on server.
  // If theme is 'system' we avoid setting an explicit class so next-themes can
  // manage it on the client and prevent hydration mismatch.
  const rawTheme = cookieStore.get("theme")?.value || "system";
  const htmlClass = rawTheme === "system" ? undefined : rawTheme;
  const colorScheme = rawTheme === "system" ? undefined : rawTheme;

  return (
    <html
  lang={locale}
  className={`
    ${barlow.variable}
    ${htmlClass ?? ""}
  `}
>
      <body className={barlow.variable}>
        <ReduxProvider>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SessionInitializer />
              <FeedbackWidget />

              {/* <Navbar /> */}

              {children}

              {/* <Footer /> */}

              <LocationModalProvider />

              <ChatWidget />

              {/* <FeedbackWidget /> */}

              <ScrollToTop />

              <ToastProvider />
            </ThemeProvider>
          </ReactQueryProvider>
        </ReduxProvider>

        {/* SEO Structured Data */}
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",

              "@type": "Organization",

              name: "adiddas",

              alternateName: [
                "adiddas",
              ],

              url: "https://www.adiddas-mocha.vercel.app",

              logo: "https://www.adiddas-mocha.vercel.app/logo.png",

              description:
                "Shop the latest adidas shoes, clothing and accessories.",

              industry: [
                "shoes",
                "clothing",
                "accessories",
              ],

              keywords: [
                "shoes",
                "clothing",
                "accessories",
              ],

              address: {
                "@type": "PostalAddress",
                addressCountry: "VN",
                addressRegion: "Hoa Binh",
              },

              areaServed: [
                "Vietnam",
                "US",
                "Global",
              ],

              knowsAbout: [
                "Optical Lens",
                "Precision Optics",
                "Camera Lens",
                "Medical Optics",
                "AI Optical Technology",
                "Optical Components",
              ],

              sameAs: [
                "https://www.facebook.com/",
                "https://www.linkedin.com/",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
