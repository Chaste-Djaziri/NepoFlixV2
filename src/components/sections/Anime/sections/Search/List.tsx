"use client";

import { tmdb } from "@/api/tmdb";
import TvShowHomeCard from "@/components/sections/TV/Cards/Poster";
import BackToTopButton from "@/components/ui/button/BackToTopButton";
import { ContentType } from "@/types";
import { isEmpty } from "@/utils/helpers";
import { Spinner } from "@heroui/react";
import { useDebouncedValue, useInViewport, useLocalStorage } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useEffect } from "react";
import { Movie, Search, TV } from "tmdb-ts/dist/types";
import MoviePosterCard from "../Movie/Cards/Poster";
import SearchFilter from "./Filter";
import { queryClient } from "@/app/providers";
import { getLoadingLabel } from "@/utils/movies";
import { SEARCH_HISTORY_STORAGE_KEY } from "@/utils/constants";

type FetchType = {
  page: number;
  type: ContentType;
  query: string;
};

const fetchData = async ({
  page,
  type = "movie",
  query,
}: FetchType): Promise<Search<Movie> | Search<TV>> => {
  if (type === "movie") return tmdb.search.movies({ query, page });
  return tmdb.search.tvShows({ query, page });
};

const SearchList = () => {
  const [searchQuery, setSearchQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery.trim(), searchQuery ? 500 : 0);
  const [content] = useQueryState(
    "content",
    parseAsStringLiteral(["movie", "tv"]).withDefault("movie"),
  );
  const [searchHistories, setSearchHistories] = useLocalStorage<string[]>({
    key: SEARCH_HISTORY_STORAGE_KEY,
    defaultValue: [],
  });

  const isSearchTriggered = !isEmpty(debouncedSearchQuery);

  const { ref, inViewport } = useInViewport();
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    enabled: isSearchTriggered,
    queryKey: ["search-list", content, debouncedSearchQuery],
    queryFn: ({ pageParam: page }) =>
      fetchData({ page, type: content, query: debouncedSearchQuery }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (inViewport) {
      fetchNextPage();
    }
  }, [inViewport]);

  useEffect(() => {
    if (debouncedSearchQuery && !searchHistories.includes(debouncedSearchQuery)) {
      const newHistories = [...searchHistories, debouncedSearchQuery].sort();
      if (newHistories.length > 10) {
        newHistories.shift();
      }
      setSearchHistories(newHistories);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    queryClient.removeQueries({ queryKey: ["search-list"] });
  }, [content]);

  const renderSearchResults = () => {
    if (isEmpty(data?.pages[0].results)) {
      return (
        <h5 className="mt-56 text-center text-xl">
          No {content === "movie" ? "movies" : "TV series"} found with query{" "}
          <span className="font-bold text-warning">"{debouncedSearchQuery}"</span>
        </h5>
      );
    }

    return (
      <>
        <h5 className="text-center text-xl">
          <span className="motion-preset-focus">
            Found <span className="font-bold text-primary">{data?.pages[0].total_results}</span>{" "}
            {content === "movie" ? "movies" : "TV series"} with query{" "}
            <span className="font-bold text-warning">"{debouncedSearchQuery}"</span>
          </span>
        </h5>
        <div className="movie-grid">
          {content === "movie"
            ? data?.pages.map((page) =>
                page.results.map((movie) => (
                  <MoviePosterCard key={movie.id} movie={movie as Movie} variant="bordered" />
                )),
              )
            : data?.pages.map((page) =>
                page.results.map((tv) => (
                  <TvShowHomeCard key={tv.id} tv={tv as TV} variant="bordered" />
                )),
              )}
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <SearchFilter
        content={content}
        isPending={isPending}
        searchQuery={searchQuery}
        searchHistories={searchHistories}
        isSearchTriggered={isSearchTriggered}
        setSearchQuery={setSearchQuery}
        setSearchHistories={setSearchHistories}
      />
      {isSearchTriggered && (
        <>
          <div className="relative flex flex-col items-center gap-8">
            {isPending ? (
              <Spinner
                size="lg"
                className="absolute-center mt-56"
                color={content === "movie" ? "primary" : "warning"}
                variant="simple"
              />
            ) : (
              renderSearchResults()
            )}
          </div>
          <div ref={ref} className="flex h-24 items-center justify-center">
            {isFetchingNextPage && (
              <Spinner
                color={content === "movie" ? "primary" : "warning"}
                size="lg"
                variant="wave"
                label={getLoadingLabel()}
              />
            )}
            {!isEmpty(data?.pages[0].results) && !hasNextPage && !isPending && (
              <p className="text-muted-foreground text-center text-base">
                You have reached the end of the list.
              </p>
            )}
          </div>
        </>
      )}

      <BackToTopButton />
    </div>
  );
};

export default SearchList;
