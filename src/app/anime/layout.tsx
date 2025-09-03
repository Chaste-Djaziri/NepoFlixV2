// Server Component (no "use client")
import TopNavbarAnime from "@/components/sections/Anime/layout/TopNavbarAnime";
import BottomNavbarAnime from "@/components/sections/Anime/layout/BottomNavbarAnime";
import FooterAnime from "@/components/sections/Anime/layout/FooterAnime";

export default function AnimeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNavbarAnime />
      <main className="container mx-auto max-w-full px-3 py-8 sm:px-5">
        {children}
      </main>
      <BottomNavbarAnime />
      <FooterAnime className="mt-8 md:mt-12" />
    </>
  );
}
