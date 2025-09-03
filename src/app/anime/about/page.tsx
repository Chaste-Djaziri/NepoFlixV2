"use client";
export default function AnimeAboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">About NepoFlix Anime</h1>
      <p className="text-sm leading-6">
        This section uses the public Jikan REST API (an unofficial MyAnimeList API) to fetch anime and manga data.
      </p>
      <p className="text-sm leading-6">
        Features include seasonal browsing, top airing/upcoming lists, search, details with characters & recommendations, and a manga view.
      </p>
    </div>
  );
}
