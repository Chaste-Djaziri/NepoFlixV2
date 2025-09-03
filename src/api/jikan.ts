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