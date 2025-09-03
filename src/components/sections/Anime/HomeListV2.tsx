"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import { Link, Skeleton } from "@heroui/react";
import { useInViewport } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { kebabCase } from "string-ts";
import AnimePosterCard from "@/components/sections/Anime/Cards/Poster";

type Kind = "airing" | "top" | "upcoming" | "random";

async function fetcher(kind: Kind) {
  const BASE = "https://api.jikan.moe/v4";
  if (kind === "airing") {
    const r = await fetch(`${BASE}/top/anime?filter=airing`);
    return (await r.json())?.data ?? [];
  }
  if (kind === "top") {
    const r = await fetch(`${BASE}/top/anime`);
    return (await r.json())?.data ?? [];
  }
  if (kind === "upcoming") {
    const r = await fetch(`${BASE}/seasons/upcoming`);
    return (await r.json())?.data ?? [];
  }
  // random -> single item wrapped as array
  const r = await fetch(`${BASE}/random/anime`);
  const j = await r.json();
  return j?.data ? [j.data] : [];
}

export default function AnimeHomeList({ name, param, kind }: { name: string; param: string; kind: Kind }) {
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
            <SectionTitle>{name}</SectionTitle>
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
            {(data ?? []).map((a: any) => (
              <div key={a.mal_id} className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2">
                <AnimePosterCard anime={a} />
              </div>
            ))}
          </Carousel>
        </div>
      )}
    </section>
  );
}
