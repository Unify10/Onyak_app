import { lookupDrugBarcode, recognizeDrugImage, searchDrugs, type DrugCandidate, type DrugImage, type DrugImageAction } from '../../api/drugs';
import QueryError from '../../components/Feedback/QueryError';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { router } from 'expo-router';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import CaptureActionPanel from '../../components/Search/CaptureActionPanel/CaptureActionPanel';
import LabelCameraModal from '../../components/Search/LabelCameraModal/LabelCameraModal';
import SearchHeader from '../../components/Search/SearchHeader/SearchHeader';
import SearchHistoryList from '../../components/Search/SearchHistoryList/SearchHistoryList';
import SearchInput from '../../components/Search/SearchInput/SearchInput';
import SearchPagination from '../../components/Search/SearchResults/SearchPagination';
import SearchResultsSkeleton from '../../components/Search/SearchResults/SearchResultsSkeleton';
import SelectedImageCard from '../../components/Search/SelectedImageCard/SelectedImageCard';
import DrugImageResults from '../../components/Search/DrugImageResults';
import AppText from '../../components/Search/AppText/AppText';
import type { CaptureAction, Medicine, SearchHistoryEntry } from '../../components/Search/types';

const SearchResults = lazy(() => import('../../components/Search/SearchResults/SearchResults'));

export type { CaptureAction, SearchHistoryEntry } from '../../components/Search/types';

type Props = {
  pendingCaptureAction: CaptureAction | null;
  captureRequestId?: string;
  onCaptureActionHandled: () => void;
  onCaptureClosed: () => void;
  initialQuery?: string | null;
  onInitialQueryHandled?: () => void;
  recentSearches: SearchHistoryEntry[];
  recentlyViewed: Medicine[];
  onSaveSearch: (entry: SearchHistoryEntry) => void;
  onDeleteSearch: (query: string) => void;
  onClearSearches: () => void;
};

export default function SearchScreen({
  recentSearches,
  recentlyViewed,
  pendingCaptureAction,
  captureRequestId,
  onCaptureActionHandled,
  onCaptureClosed,
  initialQuery,
  onInitialQueryHandled,
  onSaveSearch,
  onDeleteSearch,
  onClearSearches,
}: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const handledCaptureRequest = useRef<string | null>(null);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery?.trim() ?? '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraMode, setCameraMode] = useState<'label' | 'barcode'>('label');
  const [selectedImage, setSelectedImage] = useState<DrugImage | null>(null);
  const [imageAction, setImageAction] = useState<DrugImageAction | null>(null);
  const [barcode, setBarcode] = useState('');
  const [resultPage, setResultPage] = useState(1);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const canSearch = submittedQuery.length >= 2;
  const requestSearch = useCallback((token: string, signal: AbortSignal) => searchDrugs(submittedQuery, token, signal), [submittedQuery]);
  const { state: searchState, retry } = useProtectedQuery(requestSearch, canSearch);
  const requestImage = useCallback((token: string, signal: AbortSignal) => {
    if (!selectedImage || !imageAction) throw new Error('분석할 사진을 선택해 주세요.');
    return recognizeDrugImage(selectedImage, imageAction, {}, token, signal);
  }, [selectedImage, imageAction]);
  const { state: imageState, retry: retryImage } = useProtectedQuery(requestImage, Boolean(selectedImage && imageAction));
  const requestBarcode = useCallback((token: string, signal: AbortSignal) => lookupDrugBarcode(barcode, token, signal), [barcode]);
  const { state: barcodeState, retry: retryBarcode } = useProtectedQuery(requestBarcode, Boolean(barcode));

  const filteredMedicines = searchState.status === 'ready' ? searchState.data : [];
  const pageCount = Math.max(1, Math.ceil(filteredMedicines.length / 3));
  const visibleMedicines = filteredMedicines.slice((resultPage - 1) * 3, resultPage * 3);

  function saveSearch(term = query, category: SearchHistoryEntry['category'] = '일반의약품') {
    const value = term.trim();
    if (!value) return;
    onSaveSearch({ query: value, category, searchedAt: Date.now() });
  }

  function selectRecentSearch(entry: SearchHistoryEntry) {
    setQuery(entry.query);
    setSubmittedQuery(entry.query.trim());
    setResultPage(1);
    saveSearch(entry.query, entry.category);
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  function updateQuery(value: string) {
    setQuery(value);
    if (!value.trim()) setSubmittedQuery('');
  }

  function openMedicine(medicine: Medicine) {
    router.push({ pathname: '/medicine/[id]', params: { id: medicine.id } });
  }

  function selectMedicine(medicine: Medicine) {
    saveSearch(submittedQuery || medicine.name, medicine.category);
    openMedicine(medicine);
  }

  const openCamera = useCallback(async (mode: 'label' | 'barcode' = 'label') => {
    Keyboard.dismiss();
    try {
      const permission = await (cameraPermission?.granted
        ? Promise.resolve(cameraPermission)
        : requestCameraPermission());
      if (!permission.granted) {
        onCaptureClosed();
        Alert.alert('카메라 권한 필요', '라벨 촬영을 위해 카메라 권한을 허용해 주세요.');
        return;
      }
      setCameraMode(mode);
      setCameraVisible(true);
    } catch {
      onCaptureClosed();
      Alert.alert('카메라를 열지 못했어요', '기기의 카메라 권한과 사용 상태를 확인해주세요.');
    }
  }, [cameraPermission, requestCameraPermission, onCaptureClosed]);

  const pickImage = useCallback(async () => {
    Keyboard.dismiss();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setImageAction(null);
        setBarcode('');
        setSelectedImage({ uri: asset.uri, name: asset.fileName, mimeType: asset.mimeType, size: asset.fileSize, file: asset.file });
      }
    } catch {
      Alert.alert('사진을 불러오지 못했어요', '기기 사진 보관함에 다시 접근해 주세요.');
    } finally {
      setCameraVisible(false);
      onCaptureClosed();
    }
  }, [onCaptureClosed]);

  useEffect(() => {
    if (!pendingCaptureAction || !captureRequestId || handledCaptureRequest.current === captureRequestId) return;
    handledCaptureRequest.current = captureRequestId;
    onCaptureActionHandled();
    void Promise.resolve().then(() => pendingCaptureAction === 'gallery' ? pickImage() : openCamera());
  }, [pendingCaptureAction, captureRequestId, onCaptureActionHandled, pickImage, openCamera]);

  function submitSearch() {
    const term = query.trim().slice(0, 100);
    setBarcode('');
    if (term.length >= 2) saveSearch(term, '의약품');
    if (canSearch && term === submittedQuery) retry();
    setSubmittedQuery(term);
    setResultPage(1);
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  function closeSearchInput() {
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  function closeCamera() {
    setCameraVisible(false);
    onCaptureClosed();
  }

  function setCapturedImage(uri: string) {
    setImageAction(null);
    setBarcode('');
    setSelectedImage({ uri, name: 'label.jpg', mimeType: 'image/jpeg' });
    setCameraVisible(false);
    onCaptureClosed();
  }

  function selectImageCandidate(candidate: DrugCandidate) {
    if (candidate.drugId) {
      saveSearch(candidate.name);
      router.push({ pathname: '/medicine/[id]', params: { id: `drug-${candidate.drugId}` } });
      return;
    }
    const name = candidate.name.slice(0, 100);
    setSelectedImage(null);
    setImageAction(null);
    setQuery(name);
    setSubmittedQuery(name);
    setResultPage(1);
    saveSearch(name);
  }

  function handleBarcode(code: string) {
    setSelectedImage(null);
    setImageAction(null);
    if (barcode === code) retryBarcode();
    setBarcode(code);
    closeCamera();
  }

  return (
    <View style={styles.safe}>
      <SearchHeader focused={searchFocused} onBack={closeSearchInput} />
      <ScrollView
        style={styles.resultsScroll}
        contentContainerStyle={[styles.content, !searchFocused && pageCount > 1 && styles.contentWithPagination]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SearchInput
          value={query}
          onChange={updateQuery}
          onFocus={() => setSearchFocused(true)}
          onSubmit={submitSearch}
          onClear={() => updateQuery('')}
        />
        {searchFocused ? (
          <SearchHistoryList
            recentSearches={recentSearches}
            onSelect={selectRecentSearch}
            onDelete={onDeleteSearch}
            onClear={onClearSearches}
          />
        ) : (
          <>
            <CaptureActionPanel onPress={() => void openCamera()} onGallery={() => void pickImage()} onBarcode={() => void openCamera('barcode')} />
            {selectedImage && (
              <SelectedImageCard
                key={selectedImage.uri}
                uri={selectedImage.uri}
                busy={Boolean(imageAction && imageState.status === 'loading')}
                onRemove={() => { setSelectedImage(null); setImageAction(null); }}
                onRun={action => {
                  if (imageAction === action) retryImage();
                  setImageAction(action);
                }}
              />
            )}
            {selectedImage && imageAction && (
              imageState.status === 'loading' ? <SearchResultsSkeleton />
                : imageState.status === 'error' ? <QueryError message={imageState.message} onRetry={retryImage} />
                  : <DrugImageResults candidates={imageState.data.candidates} findings={imageState.data.findings} analyzed={imageAction === 'analyze'} onSelect={selectImageCandidate} />
            )}
            {barcode && (
              barcodeState.status === 'loading' ? <SearchResultsSkeleton />
                : barcodeState.status === 'error' ? <QueryError message={barcodeState.message} onRetry={retryBarcode} />
                  : <Suspense fallback={<SearchResultsSkeleton />}>
                      <SearchResults query={barcode} medicines={[barcodeState.data.medicine]} onSelectMedicine={selectMedicine} />
                    </Suspense>
            )}
            {!barcode && (!canSearch ? (
              recentlyViewed.length > 0 ? (
                <Suspense fallback={<SearchResultsSkeleton />}>
                  <SearchResults query="" medicines={recentlyViewed} onSelectMedicine={openMedicine} />
                </Suspense>
              ) : <AppText style={styles.searchHint}>약 이름이나 성분명을 두 글자 이상 입력해 주세요.</AppText>
            ) : searchState.status === 'loading' ? (
              <SearchResultsSkeleton />
            ) : searchState.status === 'error' ? (
              <QueryError message={searchState.message} onRetry={retry} />
            ) : (
              <Suspense fallback={<SearchResultsSkeleton />}>
                <SearchResults query={submittedQuery} medicines={visibleMedicines} onSelectMedicine={selectMedicine} />
              </Suspense>
            ))}
          </>
        )}
      </ScrollView>
      {cameraVisible && (
        <LabelCameraModal
          visible
          mode={cameraMode}
          onClose={closeCamera}
          onPickImage={() => void pickImage()}
          onImageCaptured={setCapturedImage}
          onBarcode={handleBarcode}
        />
      )}
      {!searchFocused && !barcode && pageCount > 1 && (
        <View style={styles.paginationDock}>
          <SearchPagination page={resultPage} pageCount={pageCount} onPageChange={setResultPage} />
        </View>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  resultsScroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 26 },
  searchHint: { color: '#667085', fontSize: 14, paddingVertical: 16 },
  contentWithPagination: { paddingBottom: 8 },
  paginationDock: { minHeight: 56, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF', justifyContent: 'center' },
});
