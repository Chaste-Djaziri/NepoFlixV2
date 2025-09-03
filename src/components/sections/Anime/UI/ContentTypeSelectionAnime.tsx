"use client";

import { Tabs, Tab, TabsProps } from "@heroui/react";
import { useState } from "react";
import { Film, BookOpen } from "lucide-react";

export default function ContentTypeSelectionAnime({
  onTypeChange,
  ...props
}: { onTypeChange?: (t: "anime" | "manga") => void } & TabsProps) {
  const [content, setContent] = useState<"anime" | "manga">("anime");
  const handle = (key: "anime" | "manga") => {
    setContent(key);
    onTypeChange?.(key);
  };

  return (
    <Tabs
      size="lg"
      variant="underlined"
      selectedKey={content}
      aria-label="Content Type Selection (Anime/Manga)"
      color={content === "anime" ? "primary" : "warning"}
      onSelectionChange={(value) => handle(value as "anime" | "manga")}
      classNames={{ tabContent: "pb-2", cursor: "h-1 rounded-full" }}
      {...props}
    >
      <Tab
        key="anime"
        title={
          <div className="flex items-center space-x-2">
            <Film className="h-4 w-4" />
            <span>Anime</span>
          </div>
        }
      />
      <Tab
        key="manga"
        title={
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Manga</span>
          </div>
        }
      />
    </Tabs>
  );
}
