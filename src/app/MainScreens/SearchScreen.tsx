import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

import AppText from './AppText';

// -----------------------------------------------------------------------------
// 타입 정의
// -----------------------------------------------------------------------------

type Medicine = {
  id: string;
  name: string;
  ingredient: string;
  kind: string;
  category: '일반의약품' | '영양제';
};

type SearchCategory = '일반의약품' | '영양제';
export type CaptureAction = 'label' | 'gallery' | 'barcode';

export type SearchHistoryEntry = {
  query: string;
  category: SearchCategory;
  searchedAt?: number;
};
type CameraMode = 'label' | 'barcode';

type Props = {
  pendingCaptureAction: CaptureAction | null;
  onCaptureActionHandled: () => void;
  onCaptureClosed: () => void;
  initialQuery?: string | null;
  onInitialQueryHandled?: () => void;
  recentSearches: SearchHistoryEntry[];
  onSaveSearch: (entry: SearchHistoryEntry) => void;
  onDeleteSearch: (query: string) => void;
  onClearSearches: () => void;
};

// -----------------------------------------------------------------------------
// 화면 예시용 약 데이터와 공통 색상
// 실제 약 정보는 추후 식약처 API 연결 시 교체합니다.
// -----------------------------------------------------------------------------

const medicines: Medicine[] = [
  {
    id: '1',
    name: '타이레놀정 500mg',
    ingredient: '아세트아미노펜',
    kind: '해열·진통제',
    category: '일반의약품',
  },
  {
    id: '2',
    name: '판콜에이 내복액',
    ingredient: '아세트아미노펜 외',
    kind: '종합 감기약',
    category: '일반의약품',
  },
  {
    id: '3',
    name: '애드빌 리퀴겔',
    ingredient: '이부프로펜',
    kind: '소염·진통제',
    category: '일반의약품',
  },
  {
    id: '4',
    name: '비타민D 2000IU',
    ingredient: '비타민D',
    kind: '비타민 보충',
    category: '영양제',
  },
  {
    id: '5',
    name: '오메가3',
    ingredient: 'EPA 및 DHA 함유 유지',
    kind: '건강기능식품',
    category: '영양제',
  },
];

const GREEN = '#39A887';
const INK = '#171C26';
const MUTED = '#7E8795';

// -----------------------------------------------------------------------------
// 검색 화면
// -----------------------------------------------------------------------------

export default function SearchScreen({
  recentSearches,
  pendingCaptureAction,
  onCaptureActionHandled,
  onCaptureClosed,
  initialQuery,
  onInitialQueryHandled,
  onSaveSearch,
  onDeleteSearch,
  onClearSearches,
}: Props) {
  // 화면 입력값과 표시 상태
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<SearchCategory>('일반의약품');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('label');
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(1);
  const [resultPage, setResultPage] = useState(1);
  const { width: screenWidth } = useWindowDimensions();
  const carouselWidth = Math.max(screenWidth - 40, 280);
  const carouselCardWidth = carouselWidth * 0.34;
  const carouselSidePadding = (carouselWidth - carouselCardWidth) / 2;
  const carouselScrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const carouselScrollX = useRef(new Animated.Value(carouselCardWidth)).current;
  const cameraRef = useRef<CameraView>(null);
  const barcodeHandled = useRef(false);
  const handledCaptureAction = useRef<CaptureAction | null>(null);

  // 검색 결과와 페이지 계산
  const filteredMedicines = useMemo(() => {
    const trimmedQuery = query.trim().toLocaleLowerCase();
    return medicines.filter(medicine => {
      const matchesQuery =
        !trimmedQuery ||
        [medicine.name, medicine.ingredient]
          .join(' ')
          .toLocaleLowerCase()
          .includes(trimmedQuery);
      return matchesQuery;
    });
  }, [query]);
  const pageCount = Math.max(1, Math.ceil(filteredMedicines.length / 3));
  const visibleMedicines = filteredMedicines.slice((resultPage - 1) * 3, resultPage * 3);

  useEffect(() => {
    setResultPage(1);
  }, [query]);

  // 홈 검색창에서 전달된 검색어를 첫 화면 입력값으로 반영합니다.
  useEffect(() => {
    if (initialQuery == null) return;
    setQuery(initialQuery);
    setSearchFocused(false);
    onInitialQueryHandled?.();
  }, [initialQuery, onInitialQueryHandled]);

  // 검색 기록 저장 및 재검색
  function addRecentSearch(term = query, termCategory = category) {
    const value = term.trim();
    if (!value) return;
    onSaveSearch({ query: value, category: termCategory, searchedAt: Date.now() });
  }

  function searchRecent(entry: SearchHistoryEntry) {
    setQuery(entry.query);
    setCategory(entry.category);
    setResultPage(1);
    onSaveSearch({ ...entry, searchedAt: Date.now() });
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  function openMedicine(medicine: Medicine) {
    const searchTerm = query.trim() || medicine.name;
    setQuery(searchTerm);
    addRecentSearch(searchTerm, medicine.category);
    setSelectedMedicine(medicine);
  }

  // 카메라, 사진 보관함, 바코드 기능
  async function openCamera(mode: CameraMode) {
    Keyboard.dismiss();
    const permission = cameraPermission?.granted
      ? cameraPermission
      : await requestCameraPermission();
    if (!permission.granted) {
      onCaptureClosed();
      Alert.alert('카메라 권한 필요', '라벨 촬영과 바코드 인식을 위해 카메라 권한을 허용해 주세요.');
      return;
    }
    barcodeHandled.current = false;
    setCameraMode(mode);
    setCameraVisible(true);
  }

  async function pickImage() {
    Keyboard.dismiss();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.9,
      });
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setCameraVisible(false);
      }
    } catch {
      Alert.alert('사진을 불러오지 못했어요', '기기 사진 보관함에 다시 접근해 주세요.');
    } finally {
      // 홈에서 연 사진 선택기가 취소되거나 닫혀도 홈 화면을 유지합니다.
      onCaptureClosed();
    }
  }

  async function capturePhoto() {
    try {
      const picture = await cameraRef.current?.takePictureAsync({ quality: 0.9 });
      if (picture?.uri) {
        setSelectedImage(picture.uri);
        setCameraVisible(false);
        onCaptureClosed();
      }
    } catch {
      Alert.alert('촬영하지 못했어요', '카메라를 확인한 뒤 다시 시도해 주세요.');
    }
  }

  function handleBarcode({ data }: { data: string }) {
    if (barcodeHandled.current) return;
    barcodeHandled.current = true;
    setScannedCode(data);
    setCameraVisible(false);
    onCaptureClosed();
    setQuery(data);
    setCategory('일반의약품');
    addRecentSearch(data, '일반의약품');
    Alert.alert(
      '바코드를 읽었어요',
      `인식 코드: ${data}\n식약처 품목기준코드 조회는 API 연결 후 자동으로 매핑됩니다.`,
    );
  }

  function closeCamera() {
    setCameraVisible(false);
    onCaptureClosed();
  }

  function submitSearch() {
    addRecentSearch();
    setSearchFocused(false);
    Keyboard.dismiss();
  }

  // 전체 검색 기록 삭제 전 확인
  function confirmClearSearches() {
    Alert.alert('검색 기록 삭제', '검색 기록을 모두 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '전체 삭제', style: 'destructive', onPress: onClearSearches },
    ]);
  }

  // 촬영 / 사진 / 바코드 캐러셀 항목
  const captureOptions = [
    {
      key: 'barcode',
      icon: 'barcode-outline' as const,
      title: '바코드 스캔',
      description: '일반의약품 포장의 바코드를 읽어요',
      onPress: () => openCamera('barcode'),
    },
    {
      key: 'label',
      icon: 'camera-outline' as const,
      title: '라벨 촬영',
      description: '처방전이나 약품 포장지를 촬영해요',
      onPress: () => openCamera('label'),
    },
    {
      key: 'gallery',
      icon: 'images-outline' as const,
      title: '사진에서 선택',
      description: '기기에 저장된 약 사진을 골라요',
      onPress: pickImage,
    },
  ];

  // 드래그가 끝나면 실제 세 항목 중 가장 가까운 위치에 고정
  function settleCarousel(offsetX: number) {
    const itemIndex = Math.max(
      0,
      Math.min(captureOptions.length - 1, Math.round(offsetX / carouselCardWidth)),
    );
    setCarouselIndex(itemIndex);
  }

  // 홈 화면에서 전달된 촬영 동작을 검색 화면이 열린 뒤 바로 실행
  useEffect(() => {
    if (!pendingCaptureAction) {
      handledCaptureAction.current = null;
      return;
    }
    if (handledCaptureAction.current === pendingCaptureAction) return;

    handledCaptureAction.current = pendingCaptureAction;
    onCaptureActionHandled();

    if (pendingCaptureAction === 'gallery') {
      void pickImage();
    } else {
      void openCamera(pendingCaptureAction);
    }
  }, [pendingCaptureAction]);

  // 화면 렌더링
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        {/* 검색어 입력 중에는 검색 타이틀 대신 뒤로 가기 표시 */}
        {searchFocused ? (
          <Pressable
            style={styles.backButton}
            onPress={() => {
              setSearchFocused(false);
              Keyboard.dismiss();
            }}
            accessibilityRole="button"
            accessibilityLabel="검색 화면으로 돌아가기"
          >
            <Ionicons name="chevron-back" size={27} color={INK} />
            <AppText style={styles.backButtonText}>이전</AppText>
          </Pressable>
        ) : (
          <AppText style={styles.title}>검색</AppText>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 검색어 입력창 */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={24} color="#9AA3B1" />
          <TextInput
            value={query}
            onChangeText={value => {
              setQuery(value);
              if (scannedCode && value !== scannedCode) setScannedCode(null);
            }}
            onFocus={() => setSearchFocused(true)}
            onSubmitEditing={submitSearch}
            placeholder="약 이름, 성분명으로 검색"
            placeholderTextColor="#9AA3B1"
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {!!query && (
            <Pressable
              onPress={() => {
                setQuery('');
                setScannedCode(null);
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="검색어 지우기"
            >
              <Ionicons name="close-circle" size={22} color="#AAB1BB" />
            </Pressable>
          )}
        </View>

        {/* 입력창에 포커스되면 최근 검색 기록을 보여줍니다. */}
        {searchFocused ? (
          recentSearches.length > 0 ? (
            <>
              <View style={styles.historySection}>
                <View style={styles.historyHeading}>
                  <AppText style={styles.sectionTitle}>최근 검색</AppText>
                </View>

                <View style={styles.recentList}>
                  {recentSearches.map((entry, index) => (
                    <View
                      key={`${entry.query}-${index}`}
                      style={[
                        styles.recentItem,
                        index !== recentSearches.length - 1 && styles.recentBorder,
                      ]}
                    >
                      <Pressable
                        style={styles.recentSearchButton}
                        onPress={() => searchRecent(entry)}
                        accessibilityRole="button"
                      >
                        <Ionicons name="time-outline" size={20} color={MUTED} />
                        <View style={styles.recentTextWrap}>
                          <AppText style={styles.recentText}>{entry.query}</AppText>
                          <AppText style={styles.recentDate}>
                            {new Date(entry.searchedAt ?? Date.now()).toLocaleDateString(
                              'ko-KR',
                              { month: 'numeric', day: 'numeric' },
                            )}
                          </AppText>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={() => onDeleteSearch(entry.query)}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={`${entry.query} 기록 삭제`}
                      >
                        <Ionicons name="close" size={19} color="#AAB1BB" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable
                style={styles.clearAllButton}
                onPress={confirmClearSearches}
                accessibilityRole="button"
              >
                <AppText style={styles.clearAllText}>전체 기록 삭제</AppText>
              </Pressable>
            </>
          ) : null
        ) : (
          <>
            {/* 좌우 스와이프로 선택하는 촬영 / 업로드 / 바코드 메뉴 */}
            <View style={styles.capturePanel}>
              <Animated.ScrollView
                ref={carouselScrollRef}
                horizontal
                style={[styles.captureCarousel, { width: carouselWidth }]}
                contentContainerStyle={{ paddingHorizontal: carouselSidePadding }}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                decelerationRate="fast"
                snapToInterval={carouselCardWidth}
                snapToAlignment="start"
                disableIntervalMomentum
                contentOffset={{ x: carouselIndex * carouselCardWidth, y: 0 }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: carouselScrollX } } }],
                  { useNativeDriver: true },
                )}
                onMomentumScrollEnd={event => settleCarousel(event.nativeEvent.contentOffset.x)}
                onScrollEndDrag={event => {
                  const targetOffset = event.nativeEvent.targetContentOffset?.x;
                  settleCarousel(targetOffset ?? event.nativeEvent.contentOffset.x);
                }}
              >
                {captureOptions.map((option, itemIndex) => {
                  const itemCenter = itemIndex * carouselCardWidth;
                  const distance = Math.max(carouselCardWidth, 1);
                  const selectedProgress = carouselScrollX.interpolate({
                    inputRange: [itemCenter - distance, itemCenter, itemCenter + distance],
                    outputRange: [0, 1, 0],
                    extrapolate: 'clamp',
                  });
                  const opacity = carouselScrollX.interpolate({
                    inputRange: [itemCenter - distance, itemCenter, itemCenter + distance],
                    outputRange: [0.76, 1, 0.76],
                    extrapolate: 'clamp',
                  });
                  const translateY = carouselScrollX.interpolate({
                    inputRange: [itemCenter - distance, itemCenter, itemCenter + distance],
                    outputRange: [-8, 0, -8],
                    extrapolate: 'clamp',
                  });
                  const selected = itemIndex === carouselIndex;

                  return (
                    <Pressable
                      key={`${option.key}-${itemIndex}`}
                      style={[styles.captureSlide, { width: carouselCardWidth }]}
                      onPress={() => {
                        if (selected) {
                          option.onPress();
                          return;
                        }

                        carouselScrollRef.current?.scrollTo({
                          x: itemIndex * carouselCardWidth,
                          animated: true,
                        });
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={option.title}
                      accessibilityState={{ selected }}
                    >
                      <Animated.View style={[
                        styles.captureOptionContent,
                        { opacity, transform: [{ translateY }] },
                      ]}>
                        <View style={styles.captureIcon}>
                          <Animated.View
                            pointerEvents="none"
                            style={[styles.captureIconSelectedOverlay, { opacity: selectedProgress }]}
                          />
                          <Ionicons name={option.icon} size={29} color="#FFFFFF" />
                        </View>
                        <AppText style={styles.captureTitle}>
                          {option.title}
                        </AppText>
                        <Animated.View style={[styles.captureDescriptionSlot, { opacity: selectedProgress }]}>
                          <AppText style={styles.captureDescription}>{option.description}</AppText>
                        </Animated.View>
                      </Animated.View>
                    </Pressable>
                  );
                })}
              </Animated.ScrollView>
            </View>

            {selectedImage && (
              <View style={styles.imageResultCard}>
                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                <View style={styles.imageResultInfo}>
                  <AppText style={styles.imageResultTitle}>이미지를 준비했어요</AppText>
                  <AppText style={styles.imageResultDescription}>
                    글자 추출은 OCR 서비스 연결 후 이용할 수 있어요.
                  </AppText>
                  <Pressable onPress={() => setSelectedImage(null)} accessibilityRole="button">
                    <AppText style={styles.removeImageText}>이미지 삭제</AppText>
                  </Pressable>
                </View>
              </View>
            )}

            {/* 검색 결과 목록과 페이지 이동 */}
            <View style={styles.sectionHeading}>
              <AppText style={styles.sectionTitle}>{query ? '검색 결과' : '이전 검색결과'}</AppText>
            </View>
            {scannedCode && (
              <View style={styles.barcodeNotice}>
                <Ionicons name="barcode-outline" size={19} color={GREEN} />
                <AppText style={styles.barcodeNoticeText}>인식 코드 {scannedCode} · 품목 매핑 대기</AppText>
              </View>
            )}
            {filteredMedicines.length ? visibleMedicines.map(medicine => (
              <Pressable key={medicine.id} style={styles.resultCard} onPress={() => openMedicine(medicine)} accessibilityRole="button">
                <View style={styles.medicineImagePlaceholder}>
                  <Ionicons name="medical-outline" size={24} color="#B0B6C0" />
                  <AppText style={styles.placeholderText}>약 이미지</AppText>
                </View>
                <View style={styles.medicineInfo}>
                  <AppText style={styles.medicineName}>{medicine.name}</AppText>
                  <AppText style={styles.medicineDetail}>{medicine.ingredient} · {medicine.kind}</AppText>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#C5CBD3" />
              </Pressable>
            )) : <EmptyState title="검색 결과가 없습니다." description="약 이름, 성분명 또는 증상 키워드를 확인해 주세요." />}
            {pageCount > 1 && (
              <View style={styles.pagination}>
                <Pressable
                  style={styles.pageArrow}
                  disabled={resultPage === 1}
                  onPress={() => setResultPage(page => Math.max(1, page - 1))}
                  accessibilityRole="button"
                  accessibilityLabel="이전 페이지"
                >
                  <Ionicons name="chevron-back" size={20} color={resultPage === 1 ? '#C8CDD4' : INK} />
                </Pressable>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(page => (
                  <Pressable
                    key={page}
                    style={[styles.pageNumber, page === resultPage && styles.pageNumberSelected]}
                    onPress={() => setResultPage(page)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: page === resultPage }}
                    accessibilityLabel={`페이지 ${page}`}
                  >
                    <AppText style={[styles.pageNumberText, page === resultPage && styles.pageNumberTextSelected]}>{page}</AppText>
                  </Pressable>
                ))}
                <Pressable
                  style={styles.pageArrow}
                  disabled={resultPage === pageCount}
                  onPress={() => setResultPage(page => Math.min(pageCount, page + 1))}
                  accessibilityRole="button"
                  accessibilityLabel="다음 페이지"
                >
                  <Ionicons name="chevron-forward" size={20} color={resultPage === pageCount ? '#C8CDD4' : INK} />
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* 카메라 촬영 및 바코드 스캔 화면 */}
      <Modal visible={cameraVisible} animationType="slide" onRequestClose={closeCamera}>
        <View style={styles.cameraScreen}>
          <View style={styles.cameraHeader}>
            <Pressable style={styles.cameraClose} onPress={closeCamera} accessibilityRole="button" accessibilityLabel="카메라 닫기">
              <Ionicons name="close" size={27} color="#FFFFFF" />
            </Pressable>
            <AppText style={styles.cameraScreenTitle}>{cameraMode === 'label' ? '처방전·약품 라벨 촬영' : '바코드 스캔'}</AppText>
            <View style={styles.cameraClosePlaceholder} />
          </View>
          <View style={styles.cameraPreviewArea}>
            <CameraView
              ref={cameraRef}
              style={StyleSheet.absoluteFill}
              facing="back"
              onBarcodeScanned={cameraMode === 'barcode' ? handleBarcode : undefined}
              barcodeScannerSettings={cameraMode === 'barcode' ? { barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'] } : undefined}
            />
            <View pointerEvents="none" style={styles.scanFrame}>
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />
            </View>
            <AppText style={styles.cameraHint}>
              {cameraMode === 'label' ? '약품명과 글자가 잘 보이도록 맞춰 주세요' : '바코드를 화면 안에 맞춰 주세요'}
            </AppText>
          </View>
          <View style={styles.cameraControls}>
            {cameraMode === 'label' ? (
              <>
                <Pressable style={styles.cameraSideButton} onPress={pickImage} accessibilityRole="button" accessibilityLabel="갤러리에서 선택">
                  <Ionicons name="images-outline" size={28} color="#FFFFFF" />
                </Pressable>
                <Pressable style={styles.shutterButton} onPress={capturePhoto} accessibilityRole="button" accessibilityLabel="사진 촬영">
                  <View style={styles.shutterInner} />
                </Pressable>
                <Pressable style={styles.cameraSideButton} onPress={() => setCameraMode('barcode')} accessibilityRole="button" accessibilityLabel="바코드 스캔 모드">
                  <Ionicons name="barcode-outline" size={28} color="#FFFFFF" />
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.modeSwitchButton} onPress={() => setCameraMode('label')} accessibilityRole="button">
                <Ionicons name="camera-outline" size={21} color="#FFFFFF" />
                <AppText style={styles.modeSwitchText}>라벨 촬영으로 전환</AppText>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      {/* 선택한 약의 상세 정보 */}
      <Modal visible={!!selectedMedicine} animationType="slide" transparent onRequestClose={() => setSelectedMedicine(null)}>
        <View style={styles.detailBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedMedicine(null)} accessibilityRole="button" accessibilityLabel="상세 정보 닫기" />
          <View style={styles.detailSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.detailHeader}>
              <View style={styles.detailHeadingText}>
                <AppText style={styles.detailTitle}>{selectedMedicine?.name}</AppText>
                <AppText style={styles.detailSubtitle}>{selectedMedicine?.ingredient} · {selectedMedicine?.kind}</AppText>
              </View>
              <Pressable onPress={() => setSelectedMedicine(null)} hitSlop={8} accessibilityRole="button" accessibilityLabel="상세 닫기">
                <Ionicons name="close-circle" size={28} color="#AAB1BB" />
              </Pressable>
            </View>
            <View style={styles.apiNotice}>
              <Ionicons name="information-circle-outline" size={22} color="#9B6D13" />
              <AppText style={styles.apiNoticeText}>표시된 제품명은 화면 예시입니다. 의약품 정보는 식약처 API를 연결한 뒤 확인할 수 있습니다.</AppText>
            </View>
            <InfoSection icon="medkit-outline" title="효능·효과" />
            <InfoSection icon="time-outline" title="용법·용량" />
            <InfoSection icon="warning-outline" title="주의사항·알레르기" />
            <View style={styles.detailFooter}>
              <Ionicons name="shield-checkmark-outline" size={19} color={MUTED} />
              <AppText style={styles.detailFooterText}>공식 의약품 정보가 연결되면 이 화면에 표시됩니다.</AppText>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// 공통 표시 컴포넌트
// -----------------------------------------------------------------------------

function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <View style={styles.emptyCard}>
      <Ionicons name="search-outline" size={31} color="#B5BBC3" />
      <AppText style={styles.emptyText}>{title}</AppText>
      {!!description && <AppText style={styles.emptyDescription}>{description}</AppText>}
    </View>
  );
}

function InfoSection({ icon, title }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string }) {
  return (
    <View style={styles.infoSection}>
      <View style={styles.infoIcon}><Ionicons name={icon} size={20} color={GREEN} /></View>
      <View style={styles.infoTextWrap}>
        <AppText style={styles.infoTitle}>{title}</AppText>
        <AppText style={styles.infoPending}>식약처 의약품 정보 연결 후 표시</AppText>
      </View>
      <Ionicons name="chevron-down" size={19} color="#AAB1BB" />
    </View>
  );
}

// -----------------------------------------------------------------------------
// 화면 스타일
// -----------------------------------------------------------------------------

const styles = StyleSheet.create({
  // 기본 레이아웃과 상단 영역
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 62,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: INK,
    fontSize: 26,
    fontWeight: '700',
  },
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  backButtonText: {
    color: INK,
    fontSize: 18,
    marginLeft: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 26,
  },

  // 검색 입력창과 최근 검색 기록
  searchBox: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D9DDE3',
    borderRadius: 15,
    paddingHorizontal: 14,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    color: INK,
    fontFamily: 'Pretendard',
    fontSize: 20,
    marginLeft: 10,
    paddingVertical: 10,
  },
  recentList: {
    paddingHorizontal: 0,
  },
  historySection: {
    paddingTop: 3,
  },
  historyHeading: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentItem: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E8EC',
  },
  recentSearchButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 55,
  },
  recentTextWrap: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recentText: {
    color: INK,
  },
  recentDate: {
    color: MUTED,
    fontSize: 15,
  },
  clearAllButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 5,
    paddingHorizontal: 1,
  },
  clearAllText: {
    color: MUTED,
    fontSize: 13,
  },

  // 좌우로 넘기는 촬영 옵션 캐러셀
  capturePanel: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D6DAE0',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 26,
  },
  captureCarousel: {
    height: 194,
  },
  captureSlide: {
    height: 194,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  captureOptionContent: {
    width: '100%',
    alignItems: 'center',
  },
  captureIcon: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#818894',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  captureIconSelectedOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 30,
    backgroundColor: INK,
  },
  captureTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
  },
  captureDescriptionSlot: {
    height: 44,
    justifyContent: 'flex-start',
  },
  captureDescription: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 7,
  },

  // 촬영한 이미지 미리보기
  imageResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 15,
    padding: 12,
    marginTop: -12,
    marginBottom: 20,
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 11,
    backgroundColor: '#E5E7EB',
  },
  imageResultInfo: {
    flex: 1,
    marginLeft: 13,
  },
  imageResultTitle: {
    color: INK,
    fontSize: 18,
    fontWeight: '700',
  },
  imageResultDescription: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
  removeImageText: {
    color: GREEN,
    fontSize: 15,
    marginTop: 5,
  },

  // 검색 결과 카드와 페이지 번호
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    color: MUTED,
    fontSize: 17,
  },
  resultCard: {
    minHeight: 111,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 17,
    padding: 12,
    marginBottom: 11,
  },
  medicineImagePlaceholder: {
    width: 72,
    height: 78,
    borderRadius: 13,
    backgroundColor: '#E7E9ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    gap: 3,
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  medicineInfo: {
    flex: 1,
    paddingVertical: 7,
  },
  medicineName: {
    color: INK,
    fontSize: 19,
    fontWeight: '600',
  },
  medicineDetail: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 21,
    marginTop: 4,
  },
  barcodeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF6F2',
    borderRadius: 11,
    padding: 11,
    marginBottom: 11,
  },
  barcodeNoticeText: {
    color: '#267F65',
    fontSize: 15,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 8,
    gap: 7,
  },
  pageArrow: {
    width: 34,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumber: {
    width: 34,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageNumberSelected: {
    backgroundColor: '#E8F5F1',
  },
  pageNumberText: {
    color: MUTED,
    fontSize: 17,
  },
  pageNumberTextSelected: {
    color: GREEN,
    fontWeight: '700',
  },
  emptyCard: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderRadius: 16,
    padding: 20,
  },
  emptyText: {
    color: INK,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  emptyDescription: {
    color: MUTED,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 6,
  },

  // 카메라 화면
  cameraScreen: {
    flex: 1,
    backgroundColor: '#080B10',
  },
  cameraHeader: {
    height: 100,
    paddingTop: 38,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cameraClose: {
    width: 42,
    height: 42,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cameraClosePlaceholder: {
    width: 42,
  },
  cameraScreenTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
  },
  cameraPreviewArea: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: '81%',
    height: '48%',
    position: 'absolute',
  },
  corner: {
    width: 42,
    height: 42,
    position: 'absolute',
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 13,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 13,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 13,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 13,
  },
  cameraHint: {
    position: 'absolute',
    bottom: 34,
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraControls: {
    height: 168,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 28,
  },
  cameraSideButton: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
  },
  modeSwitchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
  },
  modeSwitchText: {
    color: '#FFFFFF',
    fontSize: 17,
  },

  // 약 상세 정보 바텀 시트
  detailBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.38)',
    justifyContent: 'flex-end',
  },
  detailSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 11,
    paddingBottom: 36,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D9DDE3',
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  detailHeadingText: {
    flex: 1,
    paddingRight: 12,
  },
  detailTitle: {
    color: INK,
    fontSize: 23,
    fontWeight: '700',
  },
  detailSubtitle: {
    color: MUTED,
    fontSize: 16,
    marginTop: 5,
  },
  apiNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: '#FFF7E7',
    borderRadius: 12,
    padding: 13,
    marginBottom: 15,
  },
  apiNoticeText: {
    flex: 1,
    color: '#75591E',
    fontSize: 15,
    lineHeight: 21,
  },
  infoSection: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E9EBEF',
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EAF6F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    color: INK,
    fontSize: 17,
    fontWeight: '600',
  },
  infoPending: {
    color: MUTED,
    fontSize: 14,
    marginTop: 3,
  },
  detailFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  detailFooterText: {
    flex: 1,
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
  },
});
