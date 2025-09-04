"use client";

import Rating from "@/components/ui/other/Rating";
import { Image } from "@heroui/react";
import Link from "next/link";

export type MangaListItem = {
  id: number;
  title: string;
  poster_path: string;
  vote_average?: number;
  year?: number;
  type?: "manga";
};

interface MangaPosterCardProps {
  item: MangaListItem;
  variant?: "full" | "bordered";
}

const MangaPosterCard: React.FC<MangaPosterCardProps> = ({ item, variant = "full" }) => {
  const title = item.title ?? "Untitled";
  const posterImage = item.poster_path || "/placeholder.png";
  const releaseYear = item.year ?? "";

  // You can later create a real manga details page at /anime/manga/[id]
  const href = `/anime/manga/${item.id}`;

  if (variant === "bordered") {
    // bordered variant if needed later
  }

  return (
    <Link href={href}>
      <div className="group motion-preset-focus relative aspect-[2/3] overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-primary">
        <div className="absolute bottom-0 z-[2] h-1/2 w-full bg-gradient-to-t from-black from-[1%]" />
        <div className="absolute bottom-0 z-[3] flex w-full flex-col gap-1 px-4 py-3">
          <h6 className="truncate text-sm font-semibold">{title}</h6>
          <div className="flex justify-between text-xs">
            <p>{releaseYear}</p>
            <Rating rate={item.vote_average ?? 0} />
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

export default MangaPosterCard;
