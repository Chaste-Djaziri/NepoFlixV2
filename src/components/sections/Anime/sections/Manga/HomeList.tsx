"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import MangaPosterCard from "./Cards/Poster";

type JikanManga = {
  mal_id: number;
  title?: string | null;
  title_english?: string | null;
  title_japanese?: string | null;
  images?: {
    webp?: { image_url?: string | null; large_image_url?: string | null };
    jpg?: { image_url?: string | null; large_image_url?: string | null };
  };
  score?: number | null;
  publishing?: boolean;
  published?: { from?: string | null; to?: string | null };
};

export interface MangaHomeListProps {
  name: string;
  query: () => Promise<JikanManga[]>;
  // (optional) `href` for "See All" — can wire later
  href?: string;
}

function pickTitle(m: JikanManga) {
  return m.title_english || m.title || m.title_japanese || "Untitled";
}

function pickPoster(m: JikanManga) {
  return (
    m.images?.webp?.large_image_url ||
    m.images?.jpg?.large_image_url ||
    m.images?.webp?.image_url ||
    m.images?.jpg?.image_url ||
    "/placeholder.png"
  );
}

const MangaHomeList: React.FC<MangaHomeListProps> = ({ name, query, href }) => {
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
            <SectionTitle color="primary">{name}</SectionTitle>
            {href ? (
              <Link
                size="sm"
                href={href}
                isBlock
                color="foreground"
                className="rounded-full"
              >
                See All &gt;
              </Link>
            ) : (
              <span className="text-xs text-foreground/60 pr-1">Top 20</span>
            )}
          </div>

          <Carousel>
            {data?.map((m) => (
              <div
                key={m.mal_id}
                className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
              >
                <MangaPosterCard
                  item={{
                    id: m.mal_id,
                    title: pickTitle(m),
                    poster_path: pickPoster(m),
                    vote_average: m.score ?? 0,
                    type: "manga",
                    year: m.published?.from
                      ? new Date(m.published.from).getFullYear()
                      : undefined,
                  }}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
};

export default MangaHomeList;
