"use client";

import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

// Lazy-load the row component
const MangaHomeList = dynamic(
  () => import("@/components/sections/Anime/sections/Manga/HomeList"),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[200px] w-full overflow-hidden rounded-2xl">
        <div className="h-full w-full animate-pulse bg-muted/30" />
      </div>
    ),
  }
);

// Simple Jikan fetchers for different “Top Manga” filters
async function fetchTopManga(params: Record<string, string | number> = {}) {
  const url = new URL("https://api.jikan.moe/v4/top/manga");
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("limit", String(params.limit ?? 20));
  if (params.filter) url.searchParams.set("filter", String(params.filter));
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch top manga");
  const json = await res.json();
  return (json?.data ?? []) as any[];
}

const rows = [
  {
    name: "Top Manga",
    key: "top-manga",
    query: () => fetchTopManga(),
  },
  {
    name: "By Popularity",
    key: "popular-manga",
    query: () => fetchTopManga({ filter: "bypopularity" }),
  },
  {
    name: "Most Favorited",
    key: "favorite-manga",
    query: () => fetchTopManga({ filter: "favorite" }),
  },
  {
    name: "Publishing Now",
    key: "publishing-manga",
    query: () => fetchTopManga({ filter: "publishing" }),
  },
];

const MangaHomePage: NextPage = () => {
  return (
    <div className="flex flex-col gap-12">
      <Suspense
        fallback={
          <Spinner
            size="lg"
            color="primary"
            className="absolute-center"
            variant="simple"
          />
        }
      >
        <div className="flex flex-col gap-12">
          {rows.map((r) => (
            <MangaHomeList key={r.key} name={r.name} query={r.query} />
          ))}
        </div>
      </Suspense>
    </div>
  );
};

export default MangaHomePage;
