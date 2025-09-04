// src/components/sections/Anime/Home/ContinueWatching.tsx
"use client";

import SectionTitle from "@/components/ui/other/SectionTitle";
import Carousel from "@/components/ui/wrapper/Carousel";
import type { HistoryDetail } from "@/types/movie"; // reuse for now
import ResumeCard from "./Cards/Resume";

interface ContinueWatchingProps {
  histories: HistoryDetail[];
}

const ContinueWatching: React.FC<ContinueWatchingProps> = ({ histories }) => {
  // For anime we’ll just use primary color (or make it configurable later)
  return (
    <section id="continue-watching" className="min-h-[250px] md:min-h-[300px]">
      <div className="z-[3] flex flex-col gap-2">
        <SectionTitle color="primary">Continue Your Journey</SectionTitle>
        <Carousel>
          {histories.map((media) => (
            <div
              key={media.id}
              className="embla__slide flex min-h-fit max-w-fit items-center px-1 py-2"
            >
              <ResumeCard media={media} />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default ContinueWatching;
