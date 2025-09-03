"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";

type JikanItem =
  | ({ type: "anime" } & any)
  | ({ type: "manga" } & any);

const pickImg = (obj?: any, w: "jpg" | "webp" = "jpg") =>
  obj?.images?.[w]?.large_image_url ||
  obj?.images?.[w]?.image_url ||
  obj?.images?.jpg?.large_image_url ||
  obj?.images?.jpg?.image_url ||
  "";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchModalAnime({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 350);
  const [results, setResults] = useState<JikanItem[]>([]);
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
      setQ(""); setResults([]); setErr(null); setLoading(false);
    }
  }, [open]);

  const fetchResults = useCallback(async () => {
    const term = debouncedQ.trim();
    if (!term) {
      setResults([]); setErr(null); setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErr(null);

      const [aR, mR] = await Promise.all([
        fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(term)}&sfw`),
        fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(term)}&sfw`),
      ]);

      const aJ = await aR.json();
      const mJ = await mR.json();

      const a = (aJ?.data ?? []).slice(0, 10).map((x: any) => ({ ...x, type: "anime" as const }));
      const m = (mJ?.data ?? []).slice(0, 10).map((x: any) => ({ ...x, type: "manga" as const }));
      setResults([...a, ...m]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const hasQuery = debouncedQ.length > 0;

  return (
    <div className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
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
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-xl">
            <Search className="h-5 w-5 text-white/80" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Type to search anime or manga…"
              className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none"
              aria-label="Search query"
            />
            {q && (
              <button onClick={() => setQ("")} className="rounded-md p-1 text-white/80 hover:bg-white/10" aria-label="Clear">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button onClick={onClose} className="ml-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
            Close
          </button>
        </div>

        <div className="relative z-10 mt-4 max-h-[60vh] overflow-auto">
          {!hasQuery && <p className="px-1 text-sm text-white/80">Start typing to search anime and manga.</p>}
          {hasQuery && loading && <p className="px-1 text-sm text-white/80">Searching…</p>}
          {err && <p className="px-1 text-sm text-red-300">Couldn’t search right now: {err}</p>}
          {hasQuery && !loading && !err && results.length === 0 && <p className="px-1 text-sm text-white/80">No results.</p>}

          <ul className="space-y-2">
            {results.map((r) => {
              const poster = pickImg(r);
              const title = (r as any)?.title ?? "—";
              const href = r.type === "anime" ? `/anime/${(r as any).mal_id}` : `/anime/manga`;
              return (
                <li key={`${r.type}-${(r as any).mal_id}`}>
                  <Link href={href} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 hover:bg-white/[.08]" onClick={onClose}>
                    <div className="relative h-16 w-11 overflow-hidden rounded-md bg-white/10">
                      {poster ? (
                        <Image src={poster} alt={title} fill sizes="44px" className="object-cover" />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-white">
                        {title}
                        <span className="ml-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
                          {r.type}
                        </span>
                      </div>
                      {(r as any).synopsis && (
                        <div className="mt-1 line-clamp-2 text-xs text-white/90">{(r as any).synopsis}</div>
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
