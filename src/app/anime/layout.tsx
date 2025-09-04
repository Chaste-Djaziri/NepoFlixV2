// src/app/anime/layout.tsx
import type { Metadata, Viewport } from "next";
import { animeSiteConfig } from "@/config/animeSite"; // anime-specific config
import { Poppins } from "@/utils/fonts";
import "@/styles/globals.css";
import "@/styles/lightbox.css";
import Providers from "../providers";
import dynamic from "next/dynamic";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/utils/helpers";
import { IS_PRODUCTION, SpacingClasses } from "@/utils/constants";

// Anime-specific nav + footer
import TopNavbarAnime from "@/components/sections/Anime/ui/layout/TopNavbar";
import BottomNavbarAnime from "@/components/sections/Anime/ui/layout/BottomNavbar";
import FooterAnime from "@/components/sections/Anime/ui/layout/Footer";

const Disclaimer = dynamic(() => import("@/components/ui/overlay/Disclaimer"));

export const metadata: Metadata = {
  title: "NepoFlix Anime",
  applicationName: "NepoFlix Anime",
  description: "A cool free anime streaming platform",
  manifest: "/manifest.json",
  icons: { icon: animeSiteConfig.favicon },
  twitter: {
    card: "summary",
    title: { default: animeSiteConfig.name, template: animeSiteConfig.name },
    description: animeSiteConfig.description,
  },
  openGraph: {
    type: "website",
    siteName: "NepoFlix Anime",
    title: { default: "NepoFlix Anime", template: "Free anime site" },
    description: "Free anime site",
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

export default function AnimeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={cn("min-h-screen select-none bg-background antialiased", Poppins.className)}
      >
        <Providers>
          {IS_PRODUCTION && <Disclaimer />}

          <div className="block md:hidden h-[env(safe-area-inset-top,0px)]" />

          <TopNavbarAnime />

          <main
            className={cn(
              "container mx-auto max-w-full px-3 py-8 sm:px-5",
              SpacingClasses.main
            )}
          >
            {children}
          </main>

          <BottomNavbarAnime />
          <FooterAnime className="mt-8 md:mt-12" />
        </Providers>

        <SpeedInsights debug={false} />
        <Analytics debug={false} />
      </body>
    </html>
  );
}
