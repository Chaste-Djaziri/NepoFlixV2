// src/types/anime.ts
export type AnimeListItem = {
  id: number;
  title: string;
  imageUrl: string;
  year?: number;
  rating?: number;
  type: "movie" | "tv";
};


export interface JikanImage {
  image_url?: string;
  large_image_url?: string;
}

export interface JikanAnime {
  mal_id: number;
  url: string;
  title: string;
  images: { jpg: JikanImage; webp?: JikanImage };
  year?: number;
  episodes?: number;
  score?: number;
}

export interface JikanListResponse<T> {
  data: T[];
}

export interface JikanSingleResponse<T> {
  data: T;
}
