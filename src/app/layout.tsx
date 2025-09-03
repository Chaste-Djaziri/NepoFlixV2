// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { Poppins } from "@/utils/fonts";
import "../styles/globals.css";
import "../styles/lightbox.css";
import Providers from "./providers";
import TopNavbar from "@/components/ui/layout/TopNavbar";     // <-- normal import (client component)
import BottomNavbar from "@/components/ui/layout/BottomNavbar"; // <-- normal import (client component)
import Footer from "@/components/ui/layout/Footer";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/utils/helpers";
import { IS_PRODUCTION, SpacingClasses } from "@/utils/constants";
import Chrome from "@/components/ui/layout/Chrome";

const Disclaimer = dynamic(() => import("@/components/ui/overlay/Disclaimer"));

export const metadata: Metadata = {
  title: "NepoFlix",
  applicationName: "NepoFlix",
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
    siteName: "NepoFlix",
    title: { default: "NepoFlix", template: "Free streaming site" },
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
      <body
        suppressHydrationWarning
        className={cn("min-h-screen select-none bg-background antialiased", Poppins.className)}
      >
        <Providers>
          {IS_PRODUCTION && <Disclaimer />}
          <div className="block md:hidden h-[env(safe-area-inset-top,0px)]" />

          {/* ✅ Use Chrome to conditionally render nav/footer based on pathname */}
          <Chrome>{children}</Chrome>
        </Providers>

        <SpeedInsights debug={false} />
        <Analytics debug={false} />
      </body>
    </html>
  );
}
