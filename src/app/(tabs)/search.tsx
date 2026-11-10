import Search from '../../screens/Search/Search';
import { useSearchHistory } from '../../providers/SearchHistoryProvider';

export default function SearchRoute() {
  const { recentSearches, saveSearch, deleteSearch, clearSearches } = useSearchHistory();
  return <Search recentSearches={recentSearches} onSaveSearch={saveSearch} onDeleteSearch={deleteSearch} onClearSearches={clearSearches} />;
}
