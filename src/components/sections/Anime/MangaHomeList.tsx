"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

type Kind = "manga" | "bypopularity" | "favorite";

async function fetcher(kind: Kind) {
  const BASE = "https://api.jikan.moe/v4";
  if (kind === "manga") {
    const r = await fetch(`${BASE}/top/manga?type=manga`);
    return (await r.json())?.data ?? [];
  }
  if (kind === "bypopularity") {
    const r = await fetch(`${BASE}/top/manga?filter=bypopularity`);
    return (await r.json())?.data ?? [];
  }
  const r = await fetch(`${BASE}/top/manga?filter=favorite`);
  return (await r.json())?.data ?? [];
}

export default function MangaHomeList({ name, param, kind }: { name: string; param: string; kind: Kind }) {
  const key = kebabCase(name) + "-list";
  const { ref, inViewport } = useInViewport();
  const { data, isPending } = useQuery({
    queryFn: () => fetcher(kind),
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
            <SectionTitle color="warning">{name}</SectionTitle>
            <Link
              size="sm"
              href={`/anime/list/${param}`}
              isBlock
              color="foreground"
              className="rounded-full"
            >
              See All &gt;
            </Link>
          </div>
          <Carousel>
            {(data ?? []).map((m: any) => (
              <div key={m.mal_id} className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2">
                <AnimePosterCard anime={m} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
}
