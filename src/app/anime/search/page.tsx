"use client";
import { useState } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { searchAnime } from "@/api/jikan";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

export default function AnimeSearchPage() {
  const [q, setQ] = useState("");
  const [debounced] = useDebouncedValue(q, 400);
  const { data, isFetching } = useQuery({
    queryKey: ["anime-search", debounced],
    queryFn: () => searchAnime(debounced),
    enabled: debounced.trim().length > 0,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anime…"
          className="w-full rounded-lg border border-default-200/40 bg-transparent px-3 py-2 outline-none"
        />
      </div>

      {isFetching && <p className="text-sm text-default-500">Searching…</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {data?.data?.map((a: any) => (
          <AnimePosterCard key={a.mal_id} anime={a} />
        ))}
      </div>
    </div>
  );
}
