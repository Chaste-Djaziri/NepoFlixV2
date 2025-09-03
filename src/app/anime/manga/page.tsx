"use client";
import { useQuery } from "@tanstack/react-query";
import { getTopManga } from "@/api/jikan";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

export default function AnimeMangaPage() {
  const { data } = useQuery({ queryKey: ["manga-top"], queryFn: () => getTopManga("bypopularity") });
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Top Manga</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data?.data?.map((m: any) => <AnimePosterCard key={m.mal_id} anime={m} />)}
      </div>
    </div>
  );
}
