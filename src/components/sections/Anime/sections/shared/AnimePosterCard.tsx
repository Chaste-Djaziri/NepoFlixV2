"use client";

import Rating from "@/components/ui/other/Rating";
import { Image } from "@heroui/react";
import Link from "next/link";

export type AnimeFormat = "movie" | "tv";

export type AnimeListItem = {
  id: number;
  title: string;
  poster: string;
  score?: number;
  year?: number;
  format: AnimeFormat; // <- drives the route
};

interface AnimePosterCardProps {
  item: AnimeListItem;
  variant?: "full" | "bordered";
}

const AnimePosterCard: React.FC<AnimePosterCardProps> = ({ item, variant = "full" }) => {
  const title = item.title || "Untitled";
  const posterImage = item.poster || "/placeholder.png";
  const releaseYear = item.year ?? "";
  const href = item.format === "movie" ? `/anime/movie/${item.id}` : `/anime/tv/${item.id}`;

  // (Bordered variant can be added later if you use it in lists)
  return (
    <Link href={href}>
      <div className="group motion-preset-focus relative aspect-[2/3] overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-primary">
        <div className="absolute bottom-0 z-[2] h-1/2 w-full bg-gradient-to-t from-black from-[1%]" />
        <div className="absolute bottom-0 z-[3] flex w-full flex-col gap-1 px-4 py-3">
          <h6 className="truncate text-sm font-semibold">{title}</h6>
          <div className="flex justify-between text-xs">
            <p>{releaseYear}</p>
            <Rating rate={item.score ?? 0} />
          </div>
        </div>
        <Image
          alt={title}
          src={posterImage}
          radius="none"
          className="z-0 aspect-[2/3] h-[250px] object-cover object-center transition group-hover:scale-110 md:h-[300px]"
          classNames={{ img: "group-hover:opacity-70" }}
        />
      </div>
    </Link>
  );
};

export default AnimePosterCard;
