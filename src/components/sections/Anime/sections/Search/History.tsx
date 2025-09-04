import { Chip } from "@heroui/react";

interface SearchHistoryProps {
  searchHistories: string[];
  setSearchQuery: (history: string) => void;
  setSearchHistories: (histories: string[]) => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({
  searchHistories,
  setSearchQuery,
  setSearchHistories,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {searchHistories.map((history, index) => {
        return (
          <Chip
            as="button"
            key={history}
            onClick={() => setSearchQuery(history)}
            onClose={() =>
              setSearchHistories(
                searchHistories.filter((currentHistory) => currentHistory !== history),
              )
            }
            variant="flat"
          >
            {history}
          </Chip>
        );
      })}
    </div>
  );
};

export default SearchHistory;
