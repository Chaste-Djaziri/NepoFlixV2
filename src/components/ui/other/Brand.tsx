"use client";

import Link from "next/link";
import { Saira } from "@/utils/fonts";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { cn } from "@/utils/helpers";
import { Next } from "@/utils/icons";

export default function Brand() {
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie"),
  );

  return (
    <div>
      <Link href="/" className={Saira.className} style={{ fontWeight: 600, fontSize: 30 }}>
        <span className="flex items-center tracking-widest">
          Pop{" "}
          <span>
            <Next
              className={cn("size-full px-[2px] transition-colors", {
                "text-primary": content === "movie",
                "text-warning": content === "tv",
              })}
            />
          </span>{" "}
          Stream
        </span>
      </Link>
    </div>
  );
}