"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import AnimePosterCard from "@/components/sections/Anime/sections/Movie/Cards/Poster";

// Types: Jikan inbound, UI outbound
import type { AnimeListItem as JikanAnimeItem } from "@/api/jikan";
import type { AnimeListItem as UiAnimeItem } from "@/types/anime";

type QueryList<T = any> = {
  query: () => Promise<{ results: T[] }>;
  name: string;
  param: string;
};

const AnimeMovieHomeList: React.FC<QueryList<JikanAnimeItem>> = ({ query, name, param }) => {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: query,
    queryKey: [key],
    enabled: inViewport,
  });

  return (
    <section id={key} className="min-h-[250px] md:min-h-[300px]" ref={ref}>
      {isPending ? (
        <div className="flex w-full flex-col gap-5">
          <div className="flex flex-grow items-center justify-between">
            <Skeleton className="h-7 w-40 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-[250px] rounded-lg md:h-[300px]" />
        </div>
      ) : (
        <div className="z-[3] flex flex-col gap-2">
          <div className="flex flex-grow items-center justify-between">
            <SectionTitle>{name}</SectionTitle>
            <Link
              size="sm"
              href={`/anime/discover?type=${param}`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel>
            {data?.results.map((raw) => {
              // Normalize Jikan -> UI card shape
              const item: UiAnimeItem = {
                id: (raw as any).id ?? (raw as any).mal_id,
                title:
                  (raw as any).title ??
                  (raw as any).title_english ??
                  (raw as any).title_japanese ??
                  "Untitled",
                imageUrl:
                  (raw as any).imageUrl ??
                  (raw as any).images?.jpg?.image_url ??
                  "/placeholder.png",
                year:
                  (raw as any).year ??
                  ((raw as any).aired?.from
                    ? new Date((raw as any).aired.from).getFullYear()
                    : undefined),
                rating: (raw as any).score ?? 0,
                // force movie here because this is the Movie list
                type:
                  String((raw as any).type ?? "")
                    .toLowerCase()
                    .includes("movie")
                    ? "movie"
                    : "movie",
              };

              return (
                <div
                  key={item.id}
                  className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
                >
                  <AnimePosterCard item={item} />
                </div>
              );
            })}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default AnimeMovieHomeList;
