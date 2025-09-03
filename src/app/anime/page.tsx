"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import SearchFloatingBarAnime from "@/components/sections/Anime/UI/SearchFloatingBarAnime";
import SearchModalAnime from "@/components/sections/Anime/UI/SearchModalAnime";
import ContentTypeSelectionAnime from "@/components/sections/Anime/UI/ContentTypeSelectionAnime";
import { getUserHistories } from "@/app/actions/histories"; // optional: reuse if you have it
import { isEmpty } from "@/utils/helpers";

// (optional) reusing your component to keep layout parity
const ContinueWatching = dynamic(() => import("@/components/sections/Home/ContinueWatching"));

// anime home lists
const AnimeHomeList = dynamic(() => import("@/components/sections/Anime/HomeListV2"));
const MangaHomeList = dynamic(() => import("@/components/sections/Anime/MangaHomeList"));

const HomeHeroAnime = dynamic(() => import("@/components/sections/Anime/Hero/HomeHeroAnime"), {
  ssr: false,
  loading: () => (
    <div className="relative h-[60vh] w-full overflow-hidden rounded-3xl">
      <div className="h-full w-full animate-pulse bg-muted/30" />
    </div>
  ),
});

const AnimeHomePage: NextPage = () => {
  const [content, setContent] = useState<"anime" | "manga">("anime");
  const [openSearch, setOpenSearch] = useState(false);
  const [histories, setHistories] = useState<any[]>([]);

  // Load user histories (optional parity with movies page)
  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const { data } = await getUserHistories();
        setHistories(data || []);
      } catch {}
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
        <HomeHeroAnime content={content} />
      </div>

      {/* Continue Watching (optional parity) */}
      {!isEmpty(histories) && <ContinueWatching histories={histories} />}

      {/* Content type selection (Anime/Manga) */}
      <ContentTypeSelectionAnime className="justify-center" onTypeChange={setContent} />

      {/* Lists */}
      <Suspense
        fallback={
          <Spinner
            size="lg"
            color={content === "anime" ? "primary" : "warning"}
            className="absolute-center"
            variant="simple"
          />
        }
      >
        <div className="flex flex-col gap-12">
          {content === "anime" && (
            <>
              <AnimeHomeList name="Top Airing"   param="airing"   kind="airing" />
              <AnimeHomeList name="Top Rated"    param="top"      kind="top" />
              <AnimeHomeList name="Upcoming"     param="upcoming" kind="upcoming" />
              <AnimeHomeList name="Random Picks" param="random"   kind="random" />
            </>
          )}
          {content === "manga" && (
            <>
              <MangaHomeList name="Top Manga"        param="manga"     kind="manga" />
              <MangaHomeList name="By Popularity"    param="popular"   kind="bypopularity" />
              <MangaHomeList name="Most Favorited"   param="favorite"  kind="favorite" />
            </>
          )}
        </div>
      </Suspense>

      {/* Search modal */}
      <SearchModalAnime open={openSearch} onClose={() => setOpenSearch(false)} />
    </div>
  );
};

export default AnimeHomePage;
