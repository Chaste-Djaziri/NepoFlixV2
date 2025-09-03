"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ContentKind = "anime" | "manga";

type JikanAnime = {
  mal_id: number;
  title?: string;
  synopsis?: string;
  images?: { jpg?: { large_image_url?: string; image_url?: string }; webp?: { large_image_url?: string; image_url?: string } };
  trailer?: { url?: string };
};

type JikanManga = {
  mal_id: number;
  title?: string;
  synopsis?: string;
  images?: { jpg?: { large_image_url?: string; image_url?: string }; webp?: { large_image_url?: string; image_url?: string } };
};

const pickImg = (obj?: any) =>
  obj?.images?.jpg?.large_image_url ||
  obj?.images?.jpg?.image_url ||
  obj?.images?.webp?.large_image_url ||
  obj?.images?.webp?.image_url ||
  "/placeholder.png";

const SAMPLE_ANIME: JikanAnime = {
  mal_id: 5114,
  title: "Fullmetal Alchemist: Brotherhood",
  synopsis: "Two brothers search for the Philosopher's Stone after a failed attempt to resurrect their mother.",
  images: { jpg: { image_url: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg" } }
};

const SAMPLE_MANGA: JikanManga = {
  mal_id: 2,
  title: "Berserk",
  synopsis: "Guts, a mercenary swordsman, wanders a dark medieval world in a ceaseless struggle against fate.",
  images: { jpg: { image_url: "https://cdn.myanimelist.net/images/manga/1/157897.jpg" } }
};

async function fetchFeatured(kind: ContentKind) {
  try {
    if (kind === "anime") {
      const r = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
      const j = await r.json();
      return (j?.data ?? []) as JikanAnime[];
    } else {
      const r = await fetch("https://api.jikan.moe/v4/top/manga?type=manga");
      const j = await r.json();
      return (j?.data ?? []) as JikanManga[];
    }
  } catch {
    return kind === "anime" ? [SAMPLE_ANIME] : [SAMPLE_MANGA];
  }
}

function truncate(text = "", n = 220) {
  return text.length > n ? text.slice(0, n - 1).trimEnd() + "…" : text;
}

export default function HomeHeroAnime({ content }: { content: ContentKind }) {
  const [items, setItems] = useState<(JikanAnime | JikanManga)[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setError(null);
    fetchFeatured(content)
      .then((r) => alive && setItems(r.filter(Boolean)))
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setItems(content === "anime" ? [SAMPLE_ANIME] : [SAMPLE_MANGA]);
      });
    return () => {
      alive = false;
    };
  }, [content]);

  const featured = useMemo(() => {
    const fallback = content === "anime" ? SAMPLE_ANIME : SAMPLE_MANGA;
    if (!items.length) return fallback;
    const pool = items.slice(0, Math.min(12, items.length));
    return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
  }, [items, content]);

  const title = (featured as any)?.title ?? "Featured";
  const blurb = truncate((featured as any)?.synopsis ?? "");
  const art = pickImg(featured);

  // Deep-link ideas (you can wire these to your own routes later)
  const playHref = content === "anime" ? `/anime/${(featured as any).mal_id}` : `/anime/manga`;
  const infoHref = content === "anime" ? `/anime/${(featured as any).mal_id}` : `/anime/manga`;

  return (
    <section className="relative w-full overflow-hidden rounded-3xl">
      <div className="relative h-[60vh] w-full md:h-[72vh] transition-all duration-700 ease-out">
        <Image
          src={art}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-700 hover:scale-[1.02]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/80 backdrop-blur">
              {content === "anime" ? "Featured Anime" : "Featured Manga"}
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
                ▶ Explore
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
