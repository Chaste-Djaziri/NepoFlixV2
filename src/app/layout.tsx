// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Poppins } from "@/utils/fonts";
import "../styles/globals.css";
import "../styles/lightbox.css";
import Providers from "./providers";
import TopNavbar from "@/components/ui/layout/TopNavbar";
import BottomNavbar from "@/components/ui/layout/BottomNavbar";
import Footer from "@/components/ui/layout/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/utils/helpers";
import { IS_PRODUCTION, SpacingClasses } from "@/utils/constants";
import dynamic from "next/dynamic";

const Disclaimer = dynamic(() => import("@/components/ui/overlay/Disclaimer"));

export const metadata: Metadata = {
  title: "Pop Stream",
  applicationName: "Pop Stream",
  description: "A cool free movies streaming platform",
  manifest: "/manifest.json",
  icons: { icon: siteConfig.favicon },
  twitter: {
    card: "summary",
    title: { default: siteConfig.name, template: siteConfig.name },
    description: siteConfig.description,
  },
  openGraph: {
    type: "website",
    siteName: "Pop Stream",
    title: { default: "Pop Stream", template: "Free streaming site" },
    description: "Free streaming site",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0C0F" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className={cn("min-h-screen select-none bg-background antialiased", Poppins.className)}>
        <Providers>
          {IS_PRODUCTION && <Disclaimer />}

          {/* Mobile-only spacer so the top bar starts below iOS Safari/PWA chrome */}
          <div className="block md:hidden h-[env(safe-area-inset-top,0px)]" />

          {/* Top navigation */}
          <TopNavbar />

          {/* Main content */}
          <main className={cn("container mx-auto max-w-full px-3 py-8 sm:px-5", SpacingClasses.main)}>
            {children}
          </main>

          {/* Bottom navigation */}
          <BottomNavbar />

          {/* Footer */}
          <Footer className="mt-8 md:mt-12" />
        </Providers>

        {/* Analytics / speed insights */}
        <SpeedInsights debug={false} />
        <Analytics debug={false} />
      </body>
    </html>
  );
}
