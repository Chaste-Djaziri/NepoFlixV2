"use client";

import { Button, Chip, Image, Link, Spinner } from "@heroui/react";
import Rating from "@/components/ui/other/Rating";
import { cn } from "@/utils/helpers";
import { Calendar, List, Play, Season } from "@/utils/icons";
import { useQuery } from "@tanstack/react-query";
import { jikan } from "@/api/jikan";

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
  type?: string | null;
  episodes?: number | null;
  year?: number | null;
  aired?: { from?: string | null; to?: string | null };
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

const TvShowHoverCard: React.FC<{ id: number; fullWidth?: boolean }> = ({ id, fullWidth }) => {
  const { data, isPending } = useQuery({
    queryKey: ["anime-hover-tv", id],
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
        <Spinner size="lg" color="warning" variant="simple" className="absolute-center" />
      </div>
    );
  }
  if (!data) return null;

  const title = pickTitle(data);
  const backdropImage = imgLarge(data);
  const episodes = data.episodes ?? 0;
  const seasonsGuess = 1; // Jikan doesn’t bundle seasons; you can compute via relations if needed
  const from = data.aired?.from ? new Date(data.aired.from).getFullYear() : data.year ?? "";
  const to = data.aired?.to ? new Date(data.aired.to).getFullYear() : "";
  const years = to && from !== to ? `${from} - ${to}` : `${from}`;
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
          <Chip color="warning" size="sm" variant="faded" className="md:text-md text-xs" classNames={{ content: "font-bold" }}>
            TV
          </Chip>
          <h4 className="text-xl font-bold">{title}</h4>

          <div className="md:text-md flex flex-wrap gap-1 text-xs md:gap-2">
            <div className="flex items-center gap-1">
              <Season />
              <span>
                {seasonsGuess} Season{seasonsGuess > 1 ? "s" : ""}
              </span>
            </div>
            <p>&#8226;</p>
            <div className="flex items-center gap-1">
              <List />
              <span>
                {episodes} Episode{episodes > 1 ? "s" : ""}
              </span>
            </div>
            <p>&#8226;</p>
            <div className="flex items-center gap-1">
              <Calendar />
              <span>{years}</span>
            </div>
            <p>&#8226;</p>
            <Rating rate={data.score ?? 0} />
          </div>

          {genres && <div className="text-xs opacity-90">{genres}</div>}

          <div className="flex w-full justify-between gap-2 py-1">
            <Button as={Link} href={`/anime/${id}`} fullWidth color="warning" variant="shadow" startContent={<Play size={24} />}>
              View Details
            </Button>
          </div>

          {data.synopsis && <p className="text-sm">{data.synopsis}</p>}
        </div>
      </div>
    </div>
  );
};

export default TvShowHoverCard;
