// src/components/ui/overlay/SearchModal.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";

type TmdbItem =
  | {
      id: number;
      media_type: "movie";
      title?: string;
      overview?: string;
      poster_path?: string;
      backdrop_path?: string;
      release_date?: string;
    }
  | {
      id: number;
      media_type: "tv";
      name?: string;
      overview?: string;
      poster_path?: string;
      backdrop_path?: string;
      first_air_date?: string;
    };

const IMG = (path?: string, w: "w154" | "w342" | "w500" | "original" = "w342") =>
  path ? `https://image.tmdb.org/t/p/${w}${path}` : "";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 350);
  const [results, setResults] = useState<TmdbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ESC to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Autofocus & reset
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
    else {
      setQ("");
      setResults([]);
      setErr(null);
      setLoading(false);
    }
  }, [open]);

  const fetchResults = useCallback(async () => {
    const term = debouncedQ.trim();
    if (!term) {
      setResults([]);
      setErr(null);
      setLoading(false);
      return;
    }
    const v4 = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN; // your shared token
    const v3 = process.env.NEXT_PUBLIC_TMDB_API_KEY;      // optional fallback

    try {
      setLoading(true);
      setErr(null);

      const url = new URL("https://api.themoviedb.org/3/search/multi");
      url.searchParams.set("language", "en-GB");
      url.searchParams.set("include_adult", "false");
      url.searchParams.set("query", term);
      // If no v4 token but you have v3, use api_key
      if (!v4 && v3) url.searchParams.set("api_key", v3);

      const r = await fetch(url.toString(), {
        method: "GET",
        headers: v4
          ? { Accept: "application/json", Authorization: `Bearer ${v4}` }
          : { Accept: "application/json" },
        cache: "no-store",
      });

      const ct = r.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await r.json() : { error: await r.text() };
      if (!r.ok) throw new Error(payload?.error || `Search failed (HTTP ${r.status})`);

      const raw = Array.isArray(payload?.results) ? payload.results : [];
      const filtered = raw.filter(
        (it: any) => it?.media_type === "movie" || it?.media_type === "tv"
      );
      setResults(filtered.slice(0, 20));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const hasQuery = debouncedQ.length > 0;

  return (
    <div
      className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop + heavy blur */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Liquid glass glow blobs */}
      <div
        className={`pointer-events-none absolute left-1/2 top-24 -z-[0] h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute left-[15%] top-44 -z-[0] h-48 w-48 rounded-full bg-fuchsia-500/25 blur-3xl transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute right-[12%] top-60 -z-[0] h-56 w-56 rounded-full bg-cyan-400/25 blur-3xl transition ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel (liquid glass) */}
      <div
        className={`
          absolute left-1/2 top-24 w-[92%] max-w-3xl -translate-x-1/2
          rounded-3xl bg-white/10 p-4 shadow-[0_8px_60px_rgba(0,0,0,0.25)]
          ring-1 ring-white/25 backdrop-blur-2xl
          transition-all ${open ? "scale-100 opacity-100" : "scale-95 opacity-0"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* subtle edge gradients */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl [background:radial-gradient(120%_120%_at_10%_-10%,rgba(255,255,255,.25),rgba(255,255,255,0)_35%),radial-gradient(120%_120%_at_110%_10%,rgba(255,255,255,.18),rgba(255,255,255,0)_30%)]" />

        {/* Header */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-xl">
            <Search className="h-5 w-5 text-white/80" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Type to search…"
              className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none"
              aria-label="Search query"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="rounded-md p-1 text-white/80 hover:bg-white/10"
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 mt-4 max-h-[60vh] overflow-auto">
          {!hasQuery && (
            <p className="px-1 text-sm text-white/80">
              Start typing to search movies and TV shows. Try “Inception”, “Breaking Bad”, etc.
            </p>
          )}

          {hasQuery && loading && <p className="px-1 text-sm text-white/80">Searching…</p>}

          {err && <p className="px-1 text-sm text-red-300">Couldn’t search right now: {err}</p>}

          {hasQuery && !loading && !err && results.length === 0 && (
            <p className="px-1 text-sm text-white/80">No results.</p>
          )}

          <ul className="space-y-2">
            {results.map((r) => {
              const href = r.media_type === "movie" ? `/movie/${r.id}` : `/tv/${r.id}`;
              const poster = IMG(r.poster_path, "w342") || IMG(r.backdrop_path, "w342");
              const title = r.media_type === "movie" ? r.title : r.name;
              const sub = r.media_type === "movie" ? r.release_date : r.first_air_date;

              return (
                <li key={`${r.media_type}-${r.id}`}>
                  <Link
                    href={href}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 hover:bg-white/[.08]"
                    onClick={onClose}
                  >
                    <div className="relative h-16 w-11 overflow-hidden rounded-md bg-white/10">
                      {poster ? (
                        <Image
                          src={poster}
                          alt={title || "Poster"}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {title}
                        <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                          {r.media_type}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-white/80">{sub || "—"}</div>
                      {r.overview && (
                        <div className="mt-1 line-clamp-2 text-xs text-white/90">{r.overview}</div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative z-10 mt-3 text-right text-[11px] text-white/80">
          Tip: Press <kbd className="rounded bg-white/15 px-1">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}