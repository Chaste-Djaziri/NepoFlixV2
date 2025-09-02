// src/app/page.tsx
"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import ContinueWatching from "@/components/sections/Home/ContinueWatching";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import SearchFloatingBar from "@/components/ui/other/SearchFloatingBar";
import SearchModal from "@/components/ui/overlay/SearchModal";
import HomePageList from "@/components/sections/Home/List";
import { siteConfig } from "@/config/site";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { getUserHistories } from "./actions/histories";
import { isEmpty } from "@/utils/helpers";

const MovieHomeList = dynamic(() => import("@/components/sections/Movie/HomeList"));
const TvShowHomeList = dynamic(() => import("@/components/sections/TV/HomeList"));

const HomeHero = dynamic(() => import("@/components/sections/Home/HomeHero"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl">
      <div className="h-full w-full animate-pulse bg-muted/30" />
    </div>
  ),
});

const HomePage: NextPage = () => {
  const { movies, tvShows } = siteConfig.queryLists;
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie")
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
        <SearchFloatingBar onOpen={() => setOpenSearch(true)} />
        <HomeHero content={content} />
      </div>

      {/* Continue Watching */}
      {!isEmpty(histories) && <ContinueWatching histories={histories} />}

      {/* Content type selection */}
      <ContentTypeSelection className="justify-center" />

      {/* Movie/TV lists */}
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
            movies.map((movie) => <MovieHomeList key={movie.name} {...movie} />)}
          {content === "tv" &&
            tvShows.map((tv) => <TvShowHomeList key={tv.name} {...tv} />)}
        </div>
      </Suspense>

      {/* Search modal */}
      <SearchModal open={openSearch} onClose={() => setOpenSearch(false)} />
    </div>
  );
};

export default HomePage;
