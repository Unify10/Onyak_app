import SearchScreen, { type SearchHistoryEntry } from './SearchScreen';

type Props = {
  recentSearches: SearchHistoryEntry[];
  onSaveSearch: (entry: SearchHistoryEntry) => void;
  onDeleteSearch: (query: string) => void;
  onClearSearches: () => void;
};

export default function Search({
  recentSearches,
  onSaveSearch,
  onDeleteSearch,
  onClearSearches,
}: Props) {
  return (
    <SearchScreen
      recentSearches={recentSearches}
      pendingCaptureAction={null}
      onCaptureActionHandled={() => {}}
      onCaptureClosed={() => {}}
      onSaveSearch={onSaveSearch}
      onDeleteSearch={onDeleteSearch}
      onClearSearches={onClearSearches}
    />
  );
}
