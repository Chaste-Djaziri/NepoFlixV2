// src/components/sections/Anime/Home/List.tsx
"use client";

import ContentTypeSelection from "@/components/sections/Anime/ui/other/ContentTypeSelection";
import { animeSiteConfig } from "@/config/animeSite";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import AnimeMovieHomeList from "@/components/sections/Anime/sections/Movie/HomeList";
import AnimeTvHomeList from "@/components/sections/Anime/sections/TV/HomeList";

const HomePageList: React.FC = () => {
  const { movies, tvShows } = animeSiteConfig.queryLists;
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie"),
  );

  return (
    <div className="flex flex-col gap-12">
      <ContentTypeSelection className="justify-center" />
      <div className="flex flex-col gap-12">
        {content === "movie" &&
          movies.map((movie: any) => <AnimeMovieHomeList key={movie.name} {...movie} />)}
        {content === "tv" &&
          tvShows.map((tv: any) => <AnimeTvHomeList key={tv.name} {...tv} />)}
      </div>
    </div>
  );
};

export default HomePageList;
