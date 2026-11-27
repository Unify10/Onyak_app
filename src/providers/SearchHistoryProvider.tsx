import { createContext, useCallback, useContext, type ReactNode } from 'react';
import type { Medicine, MedicineCategory, SearchHistoryEntry } from '../components/Search/types';
import { useStoredAccountData } from '../hooks/useStoredAccountData';
import { useAuth } from './AuthProvider';

type History = { recentSearches: SearchHistoryEntry[]; recentlyViewed: Medicine[] };
type SearchHistoryContextValue = History & {
  saveSearch: (entry: SearchHistoryEntry) => void;
  saveViewedMedicine: (medicine: Medicine) => void;
  deleteSearch: (query: string) => void;
  clearSearches: () => void;
  clearHistory: () => void;
};

const searchLimit = 12;
const viewedLimit = 6;
const emptyHistory: History = { recentSearches: [], recentlyViewed: [] };
const categories: MedicineCategory[] = ['일반의약품', '영양제', '의약품'];
const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

function readHistory(value: unknown): History {
  if (!value || typeof value !== 'object') return emptyHistory;
  const { recentSearches, recentlyViewed } = value as Partial<History>;
  return {
    recentSearches: Array.isArray(recentSearches) ? recentSearches.filter(entry =>
      typeof entry?.query === 'string' && entry.query.trim() && categories.includes(entry.category)
    ).slice(0, searchLimit) : [],
    recentlyViewed: Array.isArray(recentlyViewed) ? recentlyViewed.filter(medicine =>
      typeof medicine?.id === 'string' && typeof medicine.name === 'string' && typeof medicine.ingredient === 'string'
      && typeof medicine.kind === 'string' && categories.includes(medicine.category)
    ).slice(0, viewedLimit) : [],
  };
}

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const { accountId } = useAuth();
  const { data, update, clear } = useStoredAccountData(
    accountId !== null ? `onyak.search-history.${accountId}` : null, emptyHistory, readHistory,
  );

  const saveViewedMedicine = useCallback((medicine: Medicine) => {
    if (accountId === null) return;
    update(history => ({
      ...history,
      recentlyViewed: [medicine, ...history.recentlyViewed.filter(item => item.id !== medicine.id)].slice(0, viewedLimit),
    }));
  }, [accountId, update]);

  const value: SearchHistoryContextValue = {
    ...data,
    saveViewedMedicine,
    saveSearch: entry => update(current => ({
      ...current,
      recentSearches: [entry, ...current.recentSearches.filter(item => item.query.toLowerCase() !== entry.query.toLowerCase())].slice(0, searchLimit),
    })),
    deleteSearch: query => update(current => ({ ...current, recentSearches: current.recentSearches.filter(item => item.query !== query) })),
    clearSearches: () => update(current => ({ ...current, recentSearches: [] })),
    clearHistory: clear,
  };

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (!context) throw new Error('검색 기록 제공자가 필요합니다.');
  return context;
}
