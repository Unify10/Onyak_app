import { useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Search from '../../screens/Search/Search';
import { useSearchHistory } from '../../providers/SearchHistoryProvider';

export default function SearchRoute() {
  const { capture, requestId } = useLocalSearchParams<{ capture?: string; requestId?: string }>();
  const handleCaptureAction = useCallback(() => router.setParams({ capture: undefined, requestId: undefined }), []);
  const { recentSearches, saveSearch, deleteSearch, clearSearches } = useSearchHistory();
  return <Search captureAction={capture === 'label' ? 'label' : null} captureRequestId={requestId} onCaptureActionHandled={handleCaptureAction} recentSearches={recentSearches} onSaveSearch={saveSearch} onDeleteSearch={deleteSearch} onClearSearches={clearSearches} />;
}
