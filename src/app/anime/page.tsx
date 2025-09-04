"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import ContinueWatching from "@/components/sections/Anime/sections/Home/ContinueWatching";
import ContentTypeSelectionAnime from "@/components/sections/Anime/ui/other/ContentTypeSelection"
import SearchFloatingBarAnime from "@/components/sections/Anime/ui/other/SearchFloatingBar";
import SearchModalAnime from "@/components/sections/Anime/ui/overlay/SearchModal";
import { animeSiteConfig } from "@/config/animeSite";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { getUserHistories } from "./actions/histories";
import { isEmpty } from "@/utils/helpers";

// Lists
const AnimeMovieHomeList = dynamic(
  () => import("@/components/sections/Anime/sections/Movie/HomeList")
);
const AnimeTvHomeList = dynamic(
  () => import("@/components/sections/Anime/sections/TV/HomeList")
);

// Hero
const AnimeHomeHero = dynamic(
  () => import("@/components/sections/Anime/sections/Home/HomeHero"),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl">
        <div className="h-full w-full animate-pulse bg-muted/30" />
      </div>
    ),
  }
);

const AnimeHomePage: NextPage = () => {
  const { movies, tvShows } = animeSiteConfig.queryLists;

  // Default to "tv" for anime (change to "movie" if you prefer)
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["tv", "movie"]).withDefault("tv")
  );

  const [openSearch, setOpenSearch] = useState(false);
  const [histories, setHistories] = useState<any[]>([]);

  // Load user histories
  useEffect(() => {
    const fetchHistories = async () => {
      const { data } = await getUserHistories();
      setHistories(data || []);
    };
    fetchHistories();
  }, []);

  // Global ⌘K / Ctrl+K to open modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero + floating search */}
      <div className="relative">
        <SearchFloatingBarAnime onOpen={() => setOpenSearch(true)} />
        <AnimeHomeHero content={content} />
      </div>

      {/* Continue Watching */}
      {!isEmpty(histories) && <ContinueWatching histories={histories} />}

      {/* Content type selection (TV / Movies) */}
      <ContentTypeSelectionAnime className="justify-center" />

      {/* Anime TV/Movie lists */}
      <Suspense
        fallback={
          <Spinner
            size="lg"
            color={content === "movie" ? "primary" : "warning"}
            className="absolute-center"
            variant="simple"
          />
        }
      >
        <div className="flex flex-col gap-12">
          {content === "movie" &&
            movies.map((movie: any) => (
              <AnimeMovieHomeList key={movie.name} {...movie} />
            ))}
          {content === "tv" &&
            tvShows.map((tv: any) => (
              <AnimeTvHomeList key={tv.name} {...tv} />
            ))}
        </div>
      </Suspense>

      {/* Search modal */}
      <SearchModalAnime open={openSearch} onClose={() => setOpenSearch(false)} />
    </div>
  );
};

export default AnimeHomePage;
