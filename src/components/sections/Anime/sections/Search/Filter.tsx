"use client";

import SearchInput from "@/components/ui/input/SearchInput";
import ContentTypeSelection from "@/components/ui/other/ContentTypeSelection";
import { ContentType } from "@/types";
import { cn } from "@/utils/helpers";
import SearchHistory from "./History";

interface SearchFilterProps {
  isSearchTriggered: boolean;
  isPending: boolean;
  searchQuery: string;
  searchHistories: string[];
  content: ContentType;
  setSearchQuery: (searchQuery: string) => void;
  setSearchHistories: (histories: string[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  isSearchTriggered,
  isPending,
  searchQuery,
  searchHistories,
  content,
  setSearchQuery,
  setSearchHistories,
}) => {
  return (
    <div
      className={cn("flex w-full max-w-xl flex-col justify-center gap-5 text-center", {
        "absolute-center px-3 md:px-0": !isSearchTriggered,
      })}
    >
      <ContentTypeSelection className="justify-center" />
      <SearchInput
        placeholder={`Search your favorite ${content === "movie" ? "movies" : "TV shows"}...`}
        isLoading={isPending && isSearchTriggered}
        autoFocus
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
      />
      <SearchHistory
        searchHistories={searchHistories}
        setSearchQuery={setSearchQuery}
        setSearchHistories={setSearchHistories}
      />
    </div>
  );
};

export default SearchFilter;
