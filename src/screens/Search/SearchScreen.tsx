import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import CaptureActionPanel from '../../components/Search/CaptureActionPanel/CaptureActionPanel';
import LabelCameraModal from '../../components/Search/LabelCameraModal/LabelCameraModal';
import SearchHeader from '../../components/Search/SearchHeader/SearchHeader';
import SearchHistoryList from '../../components/Search/SearchHistoryList/SearchHistoryList';
import SearchInput from '../../components/Search/SearchInput/SearchInput';
import SearchResults from '../../components/Search/SearchResults/SearchResults';
import SelectedImageCard from '../../components/Search/SelectedImageCard/SelectedImageCard';
import { medicines } from '../../components/Search/medicineData';
import type { CaptureAction, Medicine, SearchHistoryEntry } from '../../components/Search/types';

export type { CaptureAction, SearchHistoryEntry } from '../../components/Search/types';

type Props = {
  pendingCaptureAction: CaptureAction | null;
  captureRequestId?: string;
  onCaptureActionHandled: () => void;
  onCaptureClosed: () => void;
  initialQuery?: string | null;
  onInitialQueryHandled?: () => void;
  recentSearches: SearchHistoryEntry[];
  onSaveSearch: (entry: SearchHistoryEntry) => void;
  onDeleteSearch: (query: string) => void;
  onClearSearches: () => void;
};

export default function SearchScreen({
  recentSearches,
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
  const handledCaptureRequest = useRef<string | null>(null);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultPage, setResultPage] = useState(1);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const filteredMedicines = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return medicines.filter(medicine =>
      !normalizedQuery || [medicine.name, medicine.ingredient]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);
  const pageCount = Math.max(1, Math.ceil(filteredMedicines.length / 3));
  const visibleMedicines = filteredMedicines.slice((resultPage - 1) * 3, resultPage * 3);

  function saveSearch(term = query, category: SearchHistoryEntry['category'] = '일반의약품') {
    const value = term.trim();
    if (!value) return;
    onSaveSearch({ query: value, category, searchedAt: Date.now() });
  }

  function selectRecentSearch(entry: SearchHistoryEntry) {
    setQuery(entry.query);
    setResultPage(1);
    saveSearch(entry.query, entry.category);
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  function updateQuery(value: string) {
    setQuery(value);
    setResultPage(1);
  }

  function selectMedicine(medicine: Medicine) {
    setQuery(current => current.trim() || medicine.name);
    saveSearch(query.trim() || medicine.name, medicine.category);
    router.push({ pathname: '/medicine/[id]', params: { id: medicine.id } });
  }

  const openCamera = useCallback(async () => {
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
      if (!result.canceled && result.assets[0]) setSelectedImage(result.assets[0].uri);
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
    saveSearch();
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
    setSelectedImage(uri);
    setCameraVisible(false);
    onCaptureClosed();
  }

  return (
    <View style={styles.safe}>
      <SearchHeader focused={searchFocused} onBack={closeSearchInput} />
      <ScrollView
        contentContainerStyle={styles.content}
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
            <CaptureActionPanel onPress={() => void openCamera()} />
            {selectedImage && <SelectedImageCard uri={selectedImage} onRemove={() => setSelectedImage(null)} />}
            <SearchResults
              query={query}
              medicines={visibleMedicines}
              page={resultPage}
              pageCount={pageCount}
              onPageChange={setResultPage}
              onSelectMedicine={selectMedicine}
            />
          </>
        )}
      </ScrollView>
      <LabelCameraModal
        visible={cameraVisible}
        onClose={closeCamera}
        onPickImage={() => void pickImage()}
        onImageCaptured={setCapturedImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 26 },
});
