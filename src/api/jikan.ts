// Jikan API wrapper for the anime version of NepoFlix
// See https://docs.api.jikan.moe/

const BASE_URL = "https://api.jikan.moe/v4";

async function fetchJikan<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
  return res.json();
}

export const getTopAnime = () => fetchJikan<{ data: any[] }>("/top/anime");
export const getUpcomingAnime = () => fetchJikan<{ data: any[] }>("/seasons/upcoming");
export const getRandomAnime = () => fetchJikan<{ data: any }>("/random/anime");
export const getSeasonalAnime = (year: number, season: string) =>
  fetchJikan<{ data: any[] }>(`/seasons/${year}/${season}`);
export const getAnimeDetails = (id: string) => fetchJikan<{ data: any }>(`/anime/${id}/full`);
export const getAnimeCharacters = (id: string) => fetchJikan<{ data: any[] }>(`/anime/${id}/characters`);
export const getAnimeRecommendations = (id: string) => fetchJikan<{ data: any[] }>(`/anime/${id}/recommendations`);
export const searchAnime = (q: string) =>
  fetchJikan<{ data: any[] }>(`/anime?q=${encodeURIComponent(q)}&order_by=popularity&sfw`);
export const getTopManga = () => fetchJikan<{ data: any[] }>("/top/manga");


// Returns an array of available years for seasonal data
export const getSeasonsYears = () =>
  fetch(`${"https://api.jikan.moe/v4"}/seasons/years`).then(async (res) => {
    if (!res.ok) throw new Error(`Jikan API error: ${res.status}`);
    return (await res.json()) as { data: number[] };
  });

export const getAnimeImage = (anime: any): string | undefined => {
  return (
    anime?.images?.jpg?.large_image_url ||
    anime?.images?.jpg?.image_url ||
    anime?.images?.webp?.large_image_url ||
    anime?.images?.webp?.image_url
  );
};


// src/api/jikan.ts
export type JikanAnime = {
  mal_id: number;
  title?: string | null;
  title_english?: string | null;
  title_japanese?: string | null;
  synopsis?: string | null;
  score?: number | null;
  images?: {
    webp?: { image_url?: string | null; large_image_url?: string | null };
    jpg?: { image_url?: string | null; large_image_url?: string | null };
  };
  type?: "TV" | "Movie" | "OVA" | "ONA" | "Special" | string;
};

/** Normalized item your UI can consume (TMDB-ish shape) */
export type AnimeListItem = {
  id: number;                     // mal_id
  title: string;                  // EN -> title -> JP
  poster_path: string;            // any image url (we keep the name for card compat)
  backdrop_path: string;          // larger image
  overview: string;
  vote_average: number | null;
  type?: string | null;
};

function toItem(a: JikanAnime): AnimeListItem {
  const poster =
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    "";

  const backdrop =
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    "";

  return {
    id: a.mal_id,
    title: a.title_english || a.title || a.title_japanese || "Untitled",
    poster_path: poster,
    backdrop_path: backdrop,
    overview: a.synopsis || "",
    vote_average: a.score ?? null,
    type: a.type ?? null,
  };
}

async function get<T = any>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Jikan ${res.status}`);
  return res.json();
}

/** Expose queries that all resolve to { results: AnimeListItem[] } */
export const jikan = {
  airingNow: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/seasons/now?sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  popular: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?filter=bypopularity&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  upcoming: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/seasons/upcoming?sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  topRated: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  movies: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?type=movie&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  tvSeries: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?type=tv&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  ova: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?type=ova&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  ona: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?type=ona&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  special: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?type=special&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
  favorites: async () => {
    const json = await get<{ data: JikanAnime[] }>(
      "https://api.jikan.moe/v4/top/anime?filter=favorite&sfw=true"
    );
    return { results: (json.data || []).map(toItem) };
  },
};
