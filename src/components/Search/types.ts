export type MedicineCategory = '일반의약품' | '영양제';
export type CaptureAction = 'label' | 'gallery';

export type Medicine = {
  id: string;
  name: string;
  ingredient: string;
  kind: string;
  category: MedicineCategory;
};

export type SearchHistoryEntry = {
  query: string;
  category: MedicineCategory;
  searchedAt?: number;
};

export type SearchHistoryProps = {
  recentSearches: SearchHistoryEntry[];
  onSelect: (entry: SearchHistoryEntry) => void;
  onDelete: (query: string) => void;
  onClear: () => void;
};
