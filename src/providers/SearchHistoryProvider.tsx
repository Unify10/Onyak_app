import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SearchHistoryEntry } from '../components/Search/types';

type SearchHistoryContextValue = {
  recentSearches: SearchHistoryEntry[];
  saveSearch: (entry: SearchHistoryEntry) => void;
  deleteSearch: (query: string) => void;
  clearSearches: () => void;
};

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([]);
  const value = useMemo<SearchHistoryContextValue>(() => ({
    recentSearches,
    saveSearch: (entry) => setRecentSearches((current) => [
      entry,
      ...current.filter((item) => item.query.toLocaleLowerCase() !== entry.query.toLocaleLowerCase()),
    ].slice(0, 12)),
    deleteSearch: (query) => setRecentSearches((current) => current.filter((item) => item.query !== query)),
    clearSearches: () => setRecentSearches([]),
  }), [recentSearches]);

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) throw new Error('SearchHistoryProvider 안에서 검색 기록을 사용해야 합니다.');
  return context;
}
