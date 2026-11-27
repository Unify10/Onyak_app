import type { CaptureAction, Medicine } from '../../components/Search/types';
import SearchScreen, { type SearchHistoryEntry } from './SearchScreen';

type Props = {
  captureAction?: CaptureAction | null;
  captureRequestId?: string;
  onCaptureActionHandled: () => void;
  recentSearches: SearchHistoryEntry[];
  recentlyViewed: Medicine[];
  onSaveSearch: (entry: SearchHistoryEntry) => void;
  onDeleteSearch: (query: string) => void;
  onClearSearches: () => void;
};

const handleCaptureClosed = () => {};

export default function Search({
  captureAction,
  captureRequestId,
  onCaptureActionHandled,
  recentSearches,
  recentlyViewed,
  onSaveSearch,
  onDeleteSearch,
  onClearSearches,
}: Props) {
  return (
    <SearchScreen
      recentSearches={recentSearches}
      recentlyViewed={recentlyViewed}
      pendingCaptureAction={captureAction ?? null}
      captureRequestId={captureRequestId}
      onCaptureActionHandled={onCaptureActionHandled}
      onCaptureClosed={handleCaptureClosed}
      onSaveSearch={onSaveSearch}
      onDeleteSearch={onDeleteSearch}
      onClearSearches={onClearSearches}
    />
  );
}
