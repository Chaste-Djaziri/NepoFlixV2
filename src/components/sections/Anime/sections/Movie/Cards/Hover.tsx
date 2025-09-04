"use client";

import { Button, Chip, Image, Link, Spinner } from "@heroui/react";
import Rating from "@/components/ui/other/Rating";
import { cn } from "@/utils/helpers";
import { Calendar, Clock } from "@/utils/icons";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";

type JikanDetail = {
  mal_id: number;
  title?: string | null;
  title_english?: string | null;
  title_japanese?: string | null;
  synopsis?: string | null;
  images?: {
    webp?: { image_url?: string | null; large_image_url?: string | null };
    jpg?: { image_url?: string | null; large_image_url?: string | null };
  };
  score?: number | null;
  type?: string | null; // "Movie"
  duration?: string | null; // "1 hr 58 min"
  year?: number | null;
  aired?: { from?: string | null };
  genres?: { name: string }[];
};

function pickTitle(a: JikanDetail) {
  return a.title_english || a.title || a.title_japanese || "Untitled";
}
function imgLarge(a: JikanDetail) {
  return (
    a.images?.webp?.large_image_url ||
    a.images?.jpg?.large_image_url ||
    a.images?.webp?.image_url ||
    a.images?.jpg?.image_url ||
    "/placeholder.png"
  );
}

const HoverPosterCard: React.FC<{ id: number; fullWidth?: boolean }> = ({ id, fullWidth }) => {
  const { data, isPending } = useQuery({
    queryKey: ["anime-hover-movie", id],
    queryFn: async () => {
      const r = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
      if (!r.ok) throw new Error("Jikan error");
      const json = (await r.json()) as { data: JikanDetail };
      return json.data;
    },
  });

  if (isPending) {
    return (
      <div className="h-96 w-80">
        <Spinner size="lg" variant="simple" className="absolute-center" />
      </div>
    );
  }
  if (!data) return null;

  const title = pickTitle(data);
  const backdropImage = imgLarge(data);
  const releaseYear = data.year || (data.aired?.from ? new Date(data.aired.from).getFullYear() : "");
  const duration = data.duration || "";
  const genres = (data.genres || []).map((g) => g.name).join(" • ");

  return (
    <div className={cn("w-80", { "w-full": fullWidth })}>
      <div className="relative">
        <div className="absolute aspect-video h-fit w-full">
          <div className="absolute z-[2] h-full w-full bg-gradient-to-t from-secondary-background from-[1%]" />
          <Image
            radius="none"
            alt={title}
            className="z-0 aspect-video rounded-t-lg object-cover object-center"
            src={backdropImage}
          />
        </div>

        <div className="flex flex-col gap-2 p-4 pt-[40%] *:z-10">
          <div className="flex gap-3">
            <Chip size="sm" color="primary" variant="faded" className="md:text-md text-xs" classNames={{ content: "font-bold" }}>
              Movie
            </Chip>
          </div>

          <h4 className="text-xl font-bold">{title}</h4>

          <div className="md:text-md flex flex-wrap gap-1 text-xs *:z-10">
            {duration && (
              <>
                <div className="flex items-center gap-1">
                  <Clock />
                  <span>{duration}</span>
                </div>
                <p>&#8226;</p>
              </>
            )}

            <div className="flex items-center gap-1">
              <Calendar />
              <span>{releaseYear}</span>
            </div>
            <p>&#8226;</p>
            <Rating rate={data.score ?? 0} />
          </div>

          {genres && <div className="text-xs opacity-90">{genres}</div>}

          <div className="flex w-full justify-between gap-2 py-1">
            <Button
              as={Link}
              href={`/anime/${id}`}
              fullWidth
              color="primary"
              variant="shadow"
              startContent={<Icon icon="solar:play-circle-bold" fontSize={24} />}
            >
              View Details
            </Button>
          </div>

          {data.synopsis && <p className="text-sm">{data.synopsis}</p>}
        </div>
      </div>
    </div>
  );
};

export default HoverPosterCard;
