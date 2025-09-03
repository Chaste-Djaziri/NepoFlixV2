"use client";
import Link from "next/link";
import { Card, CardBody, Image } from "@heroui/react";
import type { JikanAnime } from "@/types/anime";
export default function AnimePosterCard({ anime }: { anime: JikanAnime }) {
  const img = anime.images.jpg.large_image_url || anime.images.jpg.image_url;
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <Card isPressable shadow="sm" className="h-full">
        <CardBody className="p-0">
          <Image src={img} alt={anime.title} className="w-full h-64 object-cover rounded-t-xl" />
          <div className="p-2">
            <p className="text-sm font-semibold line-clamp-2">{anime.title}</p>
            {anime.year && <p className="text-xs text-gray-500">{anime.year}</p>}
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
