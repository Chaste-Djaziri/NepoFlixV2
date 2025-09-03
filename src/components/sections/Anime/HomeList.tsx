"use client";

import { useQuery } from "@tanstack/react-query";
import AnimePosterCard from "./Cards/Poster";
import Carousel from "@/components/ui/wrapper/Carousel";
import { getTopAnime, getUpcomingAnime, getRandomAnime, getTopManga } from "@/api/jikan";

const queries = {
  topAiring: () => getTopAnime("airing"),
  upcoming: () => getUpcomingAnime(),
  topRated: () => getTopAnime(), // default top
  random: async () => {
    const r = await getRandomAnime();
    return { data: [r.data] };
  },
  topManga: () => getTopManga(),
} as const;

type QueryKey = keyof typeof queries;

export default function AnimeHomeList({ title, queryKey }: { title: string; queryKey: QueryKey }) {
  const queryFn = queries[queryKey];
  const { data, isLoading, isError } = useQuery({ queryKey: ["anime-home", queryKey], queryFn });

  return (
    <section className="py-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {isLoading && <p className="text-sm text-default-500">Loading…</p>}
      {isError && <p className="text-sm text-danger">Failed to load.</p>}
      {data?.data?.length ? (
        <Carousel>
          {data.data.map((a: any) => (
            <div key={a.mal_id} className="min-w-[160px] max-w-[180px] px-1">
              <AnimePosterCard anime={a} />
            </div>
          ))}
        </Carousel>
      ) : null}
    </section>
  );
}
