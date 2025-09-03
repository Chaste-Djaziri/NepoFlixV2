"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTopAnime, getUpcomingAnime, getRandomAnime, getTopManga } from "@/api/jikan";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

const resolvers: Record<string, () => Promise<any>> = {
  "top-airing": () => getTopAnime("airing"),
  "upcoming": () => getUpcomingAnime(),
  "top-rated": () => getTopAnime(),
  "random": async () => {
    const r = await getRandomAnime();
    return { data: [r.data] };
  },
  "top-manga": () => getTopManga(),
};

export default function AnimeListPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "top-airing";
  const queryFn = resolvers[String(slug)] || resolvers["top-airing"];
  const title = String(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const { data, isLoading, isError } = useQuery({ queryKey: ["anime-list", slug], queryFn });

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">{title}</h1>
      {isLoading && <p className="text-sm text-default-500">Loading…</p>}
      {isError && <p className="text-sm text-danger">Failed to load.</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data?.data?.map((a: any) => <AnimePosterCard key={a.mal_id} anime={a} />)}
      </div>
    </div>
  );
}
