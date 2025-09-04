"use client";

import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import Rating from "@/components/ui/other/Rating";
import { Chip, Image, Tooltip, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useCallback } from "react";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useLongPress } from "use-long-press";
import TvShowHoverCard from "./Hover";
import type { AnimeListItem } from "@/api/jikan";

export interface AnimeTvPosterCardProps {
  item: AnimeListItem;
  variant?: "full" | "bordered";
}

const AnimeTvPosterCard: React.FC<AnimeTvPosterCardProps> = ({ item, variant = "full" }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const title = item.title ?? "Untitled";
  const posterImage = item.poster_path || item.backdrop_path || "/placeholder.png";
  const releaseYear = (item as any).year ?? "";
  const isTv = (item.type || "").toLowerCase() === "tv";

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, [handlers, startVibration]);

  const longPress = useLongPress(mobile ? callback : null, {
    cancelOnMovement: true,
    threshold: 300,
  });

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<TvShowHoverCard id={item.id} />}
      >
        <Link href={`/anime/${item.id}`} ref={ref} {...longPress()}>
          {variant === "full" && (
            <div className="group motion-preset-focus relative aspect-[2/3] overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-warning">
              {hovered && (
                <Icon
                  icon="line-md:play-filled"
                  width="64"
                  height="64"
                  className="absolute-center z-20 text-white"
                />
              )}
              {isTv && (
                <Chip color="warning" size="sm" variant="flat" className="absolute left-2 top-2 z-20">
                  TV
                </Chip>
              )}
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
          )}

          {variant === "bordered" && (
            <Card isHoverable fullWidth shadow="md" className="group h-full bg-secondary-background">
              <CardHeader className="flex items-center justify-center pb-0">
                <div className="relative size-full">
                  {hovered && (
                    <Icon
                      icon="line-md:play-filled"
                      width="64"
                      height="64"
                      className="absolute-center z-20 text-white"
                    />
                  )}
                  <div className="relative overflow-hidden rounded-large">
                    <Image
                      isBlurred
                      alt={title}
                      className="aspect-[2/3] rounded-lg object-cover object-center group-hover:scale-110"
                      src={posterImage}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="justify-end pb-1">
                <p className="text-md truncate font-bold">{title}</p>
              </CardBody>
              <CardFooter className="justify-between pt-0 text-xs">
                <p>{releaseYear}</p>
                <Rating rate={item.vote_average ?? 0} />
              </CardFooter>
            </Card>
          )}
        </Link>
      </Tooltip>

      {mobile && (
        <VaulDrawer
          backdrop="blur"
          open={opened}
          onOpenChange={handlers.toggle}
          title={title}
          hiddenTitle
        >
          <TvShowHoverCard id={item.id} fullWidth />
        </VaulDrawer>
      )}
    </>
  );
};

export default AnimeTvPosterCard;
