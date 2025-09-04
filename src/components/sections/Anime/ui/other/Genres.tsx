// src/components/sections/Anime/ui/other/Genres.tsx
import { Chip, Link, ChipProps } from "@heroui/react";

export interface AnimeGenre {
  id: number | string;
  name: string;
}

export interface GenresProps {
  genres: AnimeGenre[];
  // You may still keep content param if you distinguish TV vs Movie in anime
  content?: "tv" | "movie";
  chipProps?: Omit<ChipProps, "children" | "as" | "href" | "key">;
}

const Genres: React.FC<GenresProps> = ({
  genres,
  content = "tv",
  chipProps = { size: "sm", variant: "flat", radius: "full" },
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.map(({ id, name }) => (
        <Chip as={Link} href={`/anime/discover?genres=${id}&content=${content}`} key={String(id)} {...chipProps}>
          {name}
        </Chip>
      ))}
    </div>
  );
};

export default Genres;
