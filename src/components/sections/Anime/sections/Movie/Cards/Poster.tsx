import Rating from "@/components/ui/other/Rating";
import VaulDrawer from "@/components/ui/overlay/VaulDrawer";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDeviceVibration from "@/hooks/useDeviceVibration";
import { Card, CardBody, CardFooter, CardHeader, Chip, Image, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useDisclosure, useHover } from "@mantine/hooks";
import Link from "next/link";
import { useCallback } from "react";
import { useLongPress } from "use-long-press";
import HoverPosterCard from "./Hover";
import { AnimeListItem } from "@/types/anime";

export type AnimeMoviePosterCardProps = {
  item: AnimeListItem;          // ← unified
  variant?: "full" | "bordered";
};

const MoviePosterCard: React.FC<AnimeMoviePosterCardProps> = ({ item, variant = "full" }) => {
  const { hovered, ref } = useHover();
  const [opened, handlers] = useDisclosure(false);
  const { mobile } = useBreakpoints();
  const { startVibration } = useDeviceVibration();

  const callback = useCallback(() => {
    handlers.open();
    setTimeout(() => startVibration([100]), 300);
  }, [handlers, startVibration]);

  const longPress = useLongPress(mobile ? callback : null, { cancelOnMovement: true, threshold: 300 });

  const releaseYear = item.year;
  const title = item.title;

  return (
    <>
      <Tooltip
        isDisabled={mobile}
        showArrow
        className="bg-secondary-background p-0"
        shadow="lg"
        delay={1000}
        placement="right-start"
        content={<HoverPosterCard id={item.id} />}
      >
        <Link href={`/anime/movie/${item.id}`} ref={ref} {...longPress()}>
          {variant === "full" && (
            <div className="group motion-preset-focus relative aspect-[2/3] overflow-hidden rounded-lg border-[3px] border-transparent text-white transition-colors hover:border-primary">
              {hovered && (
                <Icon icon="line-md:play-filled" width="64" height="64" className="absolute-center z-20 text-white" />
              )}
              <div className="absolute bottom-0 z-[2] h-1/2 w-full bg-gradient-to-t from-black from-[1%]" />
              <div className="absolute bottom-0 z-[3] flex w-full flex-col gap-1 px-4 py-3">
                <h6 className="truncate text-sm font-semibold">{title}</h6>
                <div className="flex justify-between text-xs">
                  <p>{releaseYear ?? "—"}</p>
                  <Rating rate={item.rating ?? 0} />
                </div>
              </div>
              <Image
                alt={title}
                src={item.imageUrl}
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
                    <Icon icon="line-md:play-filled" width="64" height="64" className="absolute-center z-20 text-white" />
                  )}
                  <div className="relative overflow-hidden rounded-large">
                    <Image isBlurred alt={title} className="aspect-[2/3] rounded-lg object-cover object-center group-hover:scale-110" src={item.imageUrl} />
                  </div>
                </div>
              </CardHeader>
              <CardBody className="justify-end pb-1">
                <p className="text-md truncate font-bold">{title}</p>
              </CardBody>
              <CardFooter className="justify-between pt-0 text-xs">
                <p>{releaseYear ?? "—"}</p>
                <Rating rate={item.rating ?? 0} />
              </CardFooter>
            </Card>
          )}
        </Link>
      </Tooltip>

      {mobile && (
        <VaulDrawer backdrop="blur" open={opened} onOpenChange={handlers.toggle} title={title} hiddenTitle>
          <HoverPosterCard id={item.id} fullWidth />
        </VaulDrawer>
      )}
    </>
  );
};

export default MoviePosterCard;
