// src/components/sections/Anime/Home/Cards/Resume.tsx
"use client";

import Rating from "@/components/ui/other/Rating";
import type { HistoryDetail } from "@/types/movie";
import { cn } from "@/utils/helpers";
import { PlayOutline } from "@/utils/icons";
import { Chip, Image, Progress } from "@heroui/react";
import Link from "next/link";
import { useCallback } from "react";

/** Minimal image fallback; wire to MAL images if you store them in history later */
const pickImage = (media: HistoryDetail) =>
  media.backdrop_path || media.poster_path || "/placeholder.png";

function timeAgo(d: string | Date) {
  const date = new Date(d);
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d2 = Math.floor(h / 24);
  return `${d2}d ago`;
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface ResumeCardProps {
  media: HistoryDetail;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ media }) => {
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : "—";
  const posterImage = pickImage(media);

  const getRedirectLink = useCallback(() => {
    // Point anime to /anime routes
    if (media.type === "movie") return `/anime/${media.media_id}/player`;
    if (media.type === "tv") return `/anime/${media.media_id}/player`;
    return `/anime/${media.media_id}`;
  }, [media]);

  return (
    <Link href={getRedirectLink()}>
      <div className={cn("group motion-preset-focus relative aspect-video overflow-hidden rounded-lg")}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <PlayOutline className="h-6 w-6 text-white" />
          </div>
        </div>

        {media.type === "tv" && (
          <Chip
            size="sm"
            variant="faded"
            radius="sm"
            color="warning"
            className="absolute right-2 top-2 z-20"
            classNames={{ content: "font-bold" }}
          >
            S{media.season} E{media.episode}
          </Chip>
        )}

        <Chip
          radius="sm"
          size="sm"
          variant="faded"
          className="absolute left-2 top-2 z-20"
          color={media.completed ? "success" : undefined}
        >
          {media.completed ? "Completed" : formatDuration(media.last_position)}
        </Chip>

        <Progress
          size="sm"
          radius="md"
          aria-label="Watch progress"
          className="absolute bottom-0 z-10 w-full"
          color="primary"
          value={media.duration ? (media.last_position / media.duration) * 100 : 0}
        />

        <div className="absolute bottom-0 z-[2] h-1/2 w-full bg-gradient-to-t from-black from-[1%]" />
        <div className="absolute bottom-0 z-[3] flex w-full flex-col gap-1 p-3 text-white">
          <div className="grid grid-cols-[1fr,auto] items-end justify-between gap-5">
            <h6 className="truncate text-sm font-semibold">{media.title}</h6>
            <p className="truncate text-xs">{timeAgo(media.updated_at)}</p>
          </div>
          <div className="flex justify-between text-xs">
            <p>{releaseYear}</p>
            <Rating rate={media.vote_average} />
          </div>
        </div>

        <Image
          alt={media.title}
          src={posterImage}
          radius="none"
          className="z-0 aspect-video h-[150px] object-cover object-center transition group-hover:scale-110 md:h-[200px]"
          classNames={{ img: "group-hover:opacity-70" }}
        />
      </div>
    </Link>
  );
};

export default ResumeCard;
