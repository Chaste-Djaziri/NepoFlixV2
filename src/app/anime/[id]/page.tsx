"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAnimeDetails, getAnimeCharacters, getAnimeRecommendations, getAnimeImage } from "@/api/jikan";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

export default function AnimeDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string;

  const { data: details } = useQuery({ queryKey: ["anime", id, "details"], queryFn: () => getAnimeDetails(id) });
  const { data: chars } = useQuery({ queryKey: ["anime", id, "chars"], queryFn: () => getAnimeCharacters(id) });
  const { data: recs } = useQuery({ queryKey: ["anime", id, "recs"], queryFn: () => getAnimeRecommendations(id) });

  const a = details?.data;
  const cover = a ? getAnimeImage(a) : undefined;

  return (
    <div className="space-y-8">
      {!a ? <p>Loading…</p> : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
          {cover && <img src={cover} alt={a.title} className="w-full rounded-xl object-cover" />}
          <div>
            <h1 className="text-2xl font-bold">{a.title}</h1>
            {a.year && <p className="text-sm text-default-500">Year: {a.year}</p>}
            {a.episodes && <p className="text-sm text-default-500">Episodes: {a.episodes}</p>}
            {a.score && <p className="text-sm text-default-500">Score: {a.score}</p>}
            {a.synopsis && <p className="mt-3 text-sm leading-6">{a.synopsis}</p>}
          </div>
        </section>
      )}

      {chars?.data?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Characters</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {chars.data.slice(0, 12).map((c: any) => (
              <div key={c.character.mal_id} className="rounded-lg border border-default-200/30 p-2">
                <img src={c.character.images.jpg.image_url} alt={c.character.name} className="h-40 w-full rounded object-cover" />
                <p className="mt-2 line-clamp-2 text-sm font-medium">{c.character.name}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {recs?.data?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Recommended</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recs.data.slice(0, 12).map((r: any) => (
              <AnimePosterCard key={r.entry.mal_id} anime={r.entry} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
