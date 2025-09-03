"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSeasonsYears, getSeasonalAnime, getUpcomingAnime } from "@/api/jikan";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

const SEASONS = ["winter","spring","summer","fall"] as const;

export default function AnimeDiscoverPage() {
  const { data: years } = useQuery({ queryKey: ["anime-years"], queryFn: () => getSeasonsYears() });
  const defaultYear = years?.data?.[0] ?? new Date().getFullYear();
  const [year, setYear] = useState<number>(defaultYear);
  const [season, setSeason] = useState<typeof SEASONS[number]>("summer");

  const { data: seasonal } = useQuery({
    queryKey: ["anime-seasonal", year, season],
    queryFn: () => getSeasonalAnime(year, season),
    enabled: !!year && !!season,
  });

  const { data: upcoming } = useQuery({
    queryKey: ["anime-upcoming"],
    queryFn: getUpcomingAnime,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm">Year</label>
        <select
          className="rounded-lg border border-default-200/40 bg-transparent px-2 py-1"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {(years?.data ?? []).slice().reverse().map((y: number) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <label className="ml-4 text-sm">Season</label>
        <select
          className="rounded-lg border border-default-200/40 bg-transparent px-2 py-1"
          value={season}
          onChange={(e) => setSeason(e.target.value as any)}
        >
          {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Seasonal</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {seasonal?.data?.map((a: any) => <AnimePosterCard key={a.mal_id} anime={a} />)}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Upcoming</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {upcoming?.data?.map((a: any) => <AnimePosterCard key={a.mal_id} anime={a} />)}
        </div>
      </section>
    </div>
  );
}
