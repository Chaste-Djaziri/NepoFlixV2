// src/components/sections/Anime/ui/other/ContentTypeSelectionAnime.tsx
"use client";

import useDiscoverFilters from "@/hooks/useDiscoverFilters";
import { ContentType } from "@/types";
import { Tabs, Tab, TabsProps } from "@heroui/react";
import { Film, Tv } from "lucide-react";

interface ContentTypeSelectionProps extends TabsProps {
  onTypeChange?: (type: ContentType) => void;
}

const ContentTypeSelectionAnime: React.FC<ContentTypeSelectionProps> = ({ onTypeChange, ...props }) => {
  const { content, setContent, resetFilters } = useDiscoverFilters();

  const handleTabChange = (key: ContentType) => {
    resetFilters();
    setContent(key);
    onTypeChange?.(key);
  };

  return (
    <Tabs
      size="lg"
      variant="underlined"
      selectedKey={content}
      aria-label="Anime Type Selection"
      color={content === "movie" ? "primary" : "warning"}
      onSelectionChange={(value) => handleTabChange(value as ContentType)}
      classNames={{ tabContent: "pb-2", cursor: "h-1 rounded-full" }}
      {...props}
    >
      <Tab
        key="tv"
        title={
          <div className="flex items-center space-x-2">
            <Tv className="h-4 w-4" />
            <span>TV (Series)</span>
          </div>
        }
      />
      <Tab
        key="movie"
        title={
          <div className="flex items-center space-x-2">
            <Film className="h-4 w-4" />
            <span>Movies</span>
          </div>
        }
      />
    </Tabs>
  );
};

export default ContentTypeSelectionAnime;
