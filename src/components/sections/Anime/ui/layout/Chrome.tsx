"use client";

import { usePathname } from "next/navigation";
import TopNavbar from "@/components/ui/layout/TopNavbar";
import BottomNavbar from "@/components/ui/layout/BottomNavbar";
import Footer from "@/components/ui/layout/Footer";
import { cn } from "@/utils/helpers";
import { SpacingClasses } from "@/utils/constants";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAnime = pathname.startsWith("/anime");

  return (
    <>
      {/* Hide site chrome on /anime */}
      {!isAnime && <TopNavbar />}

      <main className={cn("container mx-auto max-w-full px-3 py-8 sm:px-5", SpacingClasses.main)}>
        {children}
      </main>

      {!isAnime && (
        <>
          <BottomNavbar />
          <Footer className="mt-8 md:mt-12" />
        </>
      )}
    </>
  );
}
