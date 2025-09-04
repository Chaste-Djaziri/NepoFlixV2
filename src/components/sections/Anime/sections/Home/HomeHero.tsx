// src/components/sections/Anime/Hero/HomeHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/** Match the movie version's API, but adapted for Jikan */
type ContentKind = "movie" | "tv";

type JikanAnime = {
  mal_id: number;
  title?: string;
  title_english?: string | null;
  title_japanese?: string | null;
  synopsis?: string | null;
  images?: {
    jpg?: { image_url?: string; large_image_url?: string };
    webp?: { image_url?: string; large_image_url?: string };
  };
  trailer?: { images?: { maximum_image_url?: string } };
  type?: "TV" | "Movie" | string;
};

/** Safe image pick (poster/backdrop-ish) */
function pickImage(a?: JikanAnime) {
  return (
    a?.images?.webp?.large_image_url ||
    a?.images?.jpg?.large_image_url ||
    a?.trailer?.images?.maximum_image_url ||
    a?.images?.webp?.image_url ||
    a?.images?.jpg?.image_url ||
    ""
  );
}

function truncate(text = "", n = 180) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + "…" : text;
}

/** Fallbacks (static) */
const SAMPLE_MOVIE: JikanAnime = {
  mal_id: 51019,
  title: "Suzume no Tojimari",
  title_english: "Suzume",
  synopsis:
    "A chance encounter sets Suzume on a journey to close mysterious doors causing disaster across Japan.",
  images: {
    webp: {
      large_image_url: "https://cdn.myanimelist.net/images/anime/1448/127956l.webp",
    },
  },
  type: "Movie",
};

const SAMPLE_TV: JikanAnime = {
  mal_id: 52991,
  title: "Jujutsu Kaisen 2nd Season",
  synopsis:
    "Sorcerers face new curses as past and present collide in the continuation of the dark fantasy series.",
  images: {
    webp: {
      large_image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp",
    },
  },
  type: "TV",
};

/** Minimal Jikan fetchers */
async function fetchTrending(kind: ContentKind): Promise<JikanAnime[]> {
  // ‘tv’ => seasonal now; ‘movie’ => top movies
  const url =
    kind === "tv"
      ? "https://api.jikan.moe/v4/seasons/now?sfw=true"
      : "https://api.jikan.moe/v4/top/anime?type=movie&filter=bypopularity&sfw=true";

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Jikan fetch failed: ${res.status}`);
    const json = await res.json();
    const arr = Array.isArray(json?.data) ? (json.data as JikanAnime[]) : [];
    return arr.slice(0, 24);
  } catch {
    return kind === "movie" ? [SAMPLE_MOVIE] : [SAMPLE_TV];
  }
}

export default function HomeHero({ content }: { content: ContentKind }) {
  const [items, setItems] = useState<JikanAnime[]>([]);
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

  const title =
    featured.title_english ||
    featured.title ||
    featured.title_japanese ||
    (content === "movie" ? "Featured Film" : "Featured Series");

  const blurb = truncate(featured.synopsis || "", 220);
  const backdrop = pickImage(featured);

  // Routes point to your anime pages
  const playHref = `/anime/${featured.mal_id}/player`;
  const infoHref = `/anime/${featured.mal_id}`;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl">
      {/* Backdrop */}
      <div className="relative h-[60vh] w-full md:h-[72vh] transition-all duration-700 ease-out">
        <Image
          src={backdrop || "/placeholder.png"}
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
              {content === "movie" ? "Featured Anime Movie" : "Featured Anime Series"}
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {title}
            </h1>

            {!!blurb && (
              <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">{blurb}</p>
            )}

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
