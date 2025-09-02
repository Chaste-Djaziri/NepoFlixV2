// src/components/sections/Hero/HomeHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentKind = "movie" | "tv";

type TmdbItem = {
  id: number;
  title?: string;        // movies
  name?: string;         // tv
  overview?: string;
  backdrop_path?: string;
  poster_path?: string;
};

const IMG = (path?: string, w: "original" | 780 = "original") =>
  path ? `https://image.tmdb.org/t/p/${w}${path}` : "";

const SAMPLE_MOVIE: TmdbItem = {
  id: 27205,
  title: "Inception",
  overview: "A thief who steals corporate secrets through dream-sharing technology is given a chance at redemption.",
  backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
  poster_path: "/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
};

const SAMPLE_TV: TmdbItem = {
  id: 1396,
  name: "Breaking Bad",
  overview: "A chemistry teacher diagnosed with cancer starts producing methamphetamine with a former student.",
  backdrop_path: "/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
  poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
};

// Fetch trending items using TMDB v3 API key
async function fetchTrending(kind: ContentKind): Promise<TmdbItem[]> {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY; // v3 key
  if (!key) return kind === "movie" ? [SAMPLE_MOVIE] : [SAMPLE_TV];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/${kind}/day?language=en-GB&api_key=${key}`
    );
    if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
    const json = await res.json();
    return (json?.results ?? []) as TmdbItem[];
  } catch {
    return kind === "movie" ? [SAMPLE_MOVIE] : [SAMPLE_TV];
  }
}

// Utility to truncate text
function truncate(text = "", n = 180) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + "…" : text;
}

export default function HomeHero({ content }: { content: ContentKind }) {
  const [items, setItems] = useState<TmdbItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);

    fetchTrending(content)
      .then((r) => alive && setItems(r.filter(Boolean)))
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setItems(content === "movie" ? [SAMPLE_MOVIE] : [SAMPLE_TV]);
      });

    return () => {
      alive = false;
    };
  }, [content]);

  const featured = useMemo(() => {
    if (!items.length) return content === "movie" ? SAMPLE_MOVIE : SAMPLE_TV;
    const pool = items.slice(0, Math.min(12, items.length));
    return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
  }, [items, content]);

  const title = featured.title || featured.name || "Featured";
  const blurb = truncate(featured.overview, 220);
  const backdrop = IMG(featured.backdrop_path, "original");
  const poster = IMG(featured.poster_path, 780);

  const playHref =
    content === "movie"
      ? `/movie/${featured.id}/player`
      : `/tv/${featured.id}/1/1/player`;
  const infoHref = content === "movie" ? `/movie/${featured.id}` : `/tv/${featured.id}`;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full md:h-[72vh] transition-all duration-700 ease-out">
        <Image
          src={backdrop || poster || "/placeholder.png"}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Hero content */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80 backdrop-blur">
              {content === "movie" ? "Featured Film" : "Featured Series"}
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
              {blurb}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={playHref}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                ▶ Play
              </Link>
              <Link
                href={infoHref}
                className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                ℹ More info
              </Link>
            </div>

            {error && (
              <p className="mt-4 text-xs text-red-200/90">
                Using fallback data (reason: {error})
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
