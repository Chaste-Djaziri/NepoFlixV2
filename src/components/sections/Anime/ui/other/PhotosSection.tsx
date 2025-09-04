// src/components/sections/Anime/ui/other/PhotosSection.tsx
"use client";

import { Image } from "@heroui/react";
import Gallery from "@/components/ui/overlay/Gallery";
import { Slide } from "yet-another-react-lightbox";
import { useState } from "react";
import SectionTitle from "./SectionTitle";
import { Eye } from "lucide-react";

interface PhotosSectionProps {
  images: Array<{ url: string; width?: number; height?: number } | string>;
  type?: "tv" | "movie";
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ images, type = "tv" }) => {
  const normalized = images.map((it) => (typeof it === "string" ? { url: it } : it));
  const [index, setIndex] = useState<number>(-1);

  const slides: Slide[] = normalized.map(({ url, width, height }) => ({
    src: url,
    description: width && height ? `${width}x${height}` : undefined,
  }));

  return (
    <section id="gallery" className="z-[3] flex flex-col gap-2">
      <SectionTitle color={type === "movie" ? "primary" : "warning"}>Photos</SectionTitle>
      <div className="grid grid-cols-2 place-items-center gap-3 sm:grid-cols-4">
        {normalized.slice(0, 4).map(({ url }, i) => (
          <div key={`${url}-${i}`} className="group relative">
            <Image
              onClick={() => setIndex(i)}
              isBlurred
              isZoomed
              width={300}
              alt={`Image ${i + 1}`}
              src={url}
              className="aspect-video cursor-pointer"
            />

            {i === 3 && normalized.length > 4 ? (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-medium bg-black/40 text-xl font-bold text-white backdrop-blur-sm">
                +{normalized.length - 4}
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/35 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Gallery open={index >= 0} index={index} close={() => setIndex(-1)} slides={slides} />
    </section>
  );
};

export default PhotosSection;
