import { Film, BookOpen, Dice6, Search, ChevronDown } from "lucide-react";

export const animeSiteConfig = {
  name: "NepoFlix · Anime",
  description: "Discover anime & manga — airing, top, upcoming, random picks.",
  favicon: "/favicon.ico",
  socials: {
    github: "https://github.com/Chaste-Djaziri",
    twitter: "",
    instagram: "",
  },
  // Top-level nav (desktop) + used by bottom bar on mobile
  navItems: [
    { label: "Home", href: "/anime", icon: <Film className="h-5 w-5" />, activeIcon: <Film className="h-5 w-5" /> },
    { label: "Random", href: "/anime/random", icon: <Dice6 className="h-5 w-5" />, activeIcon: <Dice6 className="h-5 w-5" /> },
    { label: "Manga", href: "/anime?content=manga", icon: <BookOpen className="h-5 w-5" />, activeIcon: <BookOpen className="h-5 w-5" /> },
    { label: "Search", href: "/anime/search", icon: <Search className="h-5 w-5" />, activeIcon: <Search className="h-5 w-5" /> },
  ],
  // "More" menu
  moreItems: [
    { label: "Dubbed", href: "/anime/discover?audio=dub" },
    { label: "Subbed", href: "/anime/discover?audio=sub" },
    { label: "Genres", href: "/anime/genres" },
    { label: "OVA", href: "/anime/discover?format=ova" },
    { label: "ONA", href: "/anime/discover?format=ona" },
    { label: "Movies", href: "/anime/discover?format=movie" },
    { label: "TV Series", href: "/anime/discover?format=tv" },
    { label: "Special", href: "/anime/discover?format=special" },
    { label: "Seasons", href: "/anime/seasons" },
    { label: "Top Airing", href: "/anime/list/airing" },
    { label: "Upcoming", href: "/anime/list/upcoming" },
  ],
  // header utility icons
  headerIcons: {
    more: <ChevronDown className="h-4 w-4" />,
  },
} as const;
