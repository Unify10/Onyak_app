import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

type Medicine = {
  id: string;
  name: string;
  detail: string;
  category: '일반의약품' | '영양제';
};

const medicines: Medicine[] = [
  {
    id: '1',
    name: '타이레놀정 500mg',
    detail: '아세트아미노펜 · 해열진통제',
    category: '일반의약품',
  },
  {
    id: '2',
    name: '판콜에이 내복액',
    detail: '감기 증상 완화',
    category: '일반의약품',
  },
  {
    id: '3',
    name: '애드빌 리퀴겔',
    detail: '이부프로펜 · 소염진통제',
    category: '일반의약품',
  },
  {
    id: '4',
    name: '비타민D 2000IU',
    detail: '비타민D · 건강기능식품',
    category: '영양제',
  },
  {
    id: '5',
    name: '오메가3',
    detail: 'EPA 및 DHA 함유 유지',
    category: '영양제',
  },
];

type Category = '일반의약품' | '영양제' | '최근 검색';

const GREEN = '#39A887';
const INK = '#20242B';
const MUTED = '#8B929D';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('일반의약품');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    '타이레놀',
    '비타민D',
  ]);

  const filteredMedicines = useMemo(() => {
    const source =
      category === '영양제'
        ? medicines.filter(item => item.category === '영양제')
        : medicines.filter(item => item.category === '일반의약품');

    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return source;

    return source.filter(item =>
      `${item.name} ${item.detail}`.toLowerCase().includes(trimmedQuery),
    );
  }, [category, query]);

  function searchRecent(term: string) {
    setQuery(term);
    setCategory(term.toLowerCase().includes('비타민') ? '영양제' : '일반의약품');
  }

  function addRecentSearch() {
    const term = query.trim();
    if (!term) return;

    setRecentSearches(current => [
      term,
      ...current.filter(item => item !== term),
    ]);
  }

  function addMedicine(medicine: Medicine) {
    addRecentSearch();
    Alert.alert(
      '약 추가',
      `${medicine.name}을(를) 복용 목록에 추가하는 기능은 실제 서비스 연동이 필요합니다.`,
    );
  }

  function openCamera() {
    Alert.alert(
      '사진으로 약 찾기',
      '카메라와 사진 인식 기능은 아직 연결되지 않았습니다.',
    );
  }

  const displayedMedicines =
    category === '최근 검색' ? [] : filteredMedicines;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText style={styles.title}>약 검색</AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={22} color={MUTED} />

          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={addRecentSearch}
            placeholder="약 이름 또는 성분을 검색해 보세요"
            placeholderTextColor="#A5ABB3"
            style={styles.searchInput}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="검색어 지우기"
            >
              <Ionicons name="close-circle" size={21} color="#B5BBC3" />
            </Pressable>
          )}
        </View>

        <Pressable
          style={styles.cameraPanel}
          onPress={openCamera}
          accessibilityRole="button"
        >
          <View style={styles.cameraIcon}>
            <Ionicons name="camera-outline" size={27} color={GREEN} />
          </View>

          <AppText style={styles.cameraTitle}>약 사진으로 찾기</AppText>
          <AppText style={styles.cameraDescription}>
            약 봉투나 제품을 촬영해 정보를 확인해요
          </AppText>

          <View style={styles.cameraButton}>
            <AppText style={styles.cameraButtonText}>사진 촬영하기</AppText>
          </View>
        </Pressable>

        <View style={styles.categoryRow}>
          {(['일반의약품', '영양제', '최근 검색'] as Category[]).map(item => {
            const selected = category === item;

            return (
              <Pressable
                key={item}
                style={[
                  styles.categoryChip,
                  selected && styles.categorySelected,
                ]}
                onPress={() => setCategory(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <AppText
                  style={[
                    styles.categoryText,
                    selected && styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {category === '최근 검색' ? (
          <>
            <View style={styles.sectionHeading}>
              <AppText style={styles.sectionTitle}>최근 검색</AppText>

              {recentSearches.length > 0 && (
                <Pressable
                  onPress={() => setRecentSearches([])}
                  accessibilityRole="button"
                >
                  <AppText style={styles.clearText}>전체 삭제</AppText>
                </Pressable>
              )}
            </View>

            {recentSearches.length > 0 ? (
              <View style={styles.recentList}>
                {recentSearches.map((term, index) => (
                  <Pressable
                    key={`${term}-${index}`}
                    style={[
                      styles.recentItem,
                      index < recentSearches.length - 1 &&
                        styles.recentItemBorder,
                    ]}
                    onPress={() => searchRecent(term)}
                    accessibilityRole="button"
                  >
                    <Ionicons name="time-outline" size={20} color={MUTED} />
                    <AppText style={styles.recentText}>{term}</AppText>
                    <Ionicons
                      name="arrow-up-outline"
                      size={19}
                      color="#B5BBC3"
                    />
                  </Pressable>
                ))}
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="time-outline" size={32} color="#B5BBC3" />
                <AppText style={styles.emptyText}>
                  최근 검색 내역이 없습니다.
                </AppText>
              </View>
            )}
          </>
        ) : (
          <>
            <View style={styles.sectionHeading}>
              <AppText style={styles.sectionTitle}>검색 결과</AppText>
              <AppText style={styles.resultCount}>
                {displayedMedicines.length}개
              </AppText>
            </View>

            {displayedMedicines.length > 0 ? (
              displayedMedicines.map(medicine => (
                <View key={medicine.id} style={styles.resultCard}>
                  <View style={styles.pillIcon}>
                    <Ionicons name="medical-outline" size={23} color={GREEN} />
                  </View>

                  <Pressable
                    style={styles.medicineInfo}
                    onPress={() =>
                      Alert.alert(
                        medicine.name,
                        `${medicine.detail}\n\n약 상세 정보는 실제 의약품 데이터 연동이 필요합니다.`,
                      )
                    }
                    accessibilityRole="button"
                  >
                    <AppText style={styles.medicineName}>
                      {medicine.name}
                    </AppText>
                    <AppText style={styles.medicineDetail}>
                      {medicine.detail}
                    </AppText>
                  </Pressable>

                  <Pressable
                    style={styles.addButton}
                    onPress={() => addMedicine(medicine)}
                    accessibilityRole="button"
                    accessibilityLabel={`${medicine.name} 추가`}
                  >
                    <Ionicons name="add" size={23} color={GREEN} />
                  </Pressable>
                </View>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="search-outline" size={32} color="#B5BBC3" />
                <AppText style={styles.emptyText}>
                  검색 결과가 없습니다.
                </AppText>
                <AppText style={styles.emptySubtext}>
                  다른 이름이나 성분으로 검색해 보세요.
                </AppText>
              </View>
            )}
          </>
        )}

        <AppText style={styles.note}>
          약 이름과 검색 결과는 예시 데이터입니다. 실제 약 정보 검색 및 사진 인식은
          의약품 데이터와 카메라 기능 연동이 필요합니다.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  searchBox: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E9EC',
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    color: INK,
    fontFamily: 'Pretendard',
    fontSize: 20,
    marginLeft: 10,
    paddingVertical: 8,
  },
  cameraPanel: {
    alignItems: 'center',
    backgroundColor: '#E8F6F1',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 21,
  },
  cameraIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cameraTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
  },
  cameraDescription: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 6,
  },
  cameraButton: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginTop: 14,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 21,
  },
  categoryChip: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 7,
  },
  categorySelected: {
    backgroundColor: GREEN,
  },
  categoryText: {
    color: MUTED,
    fontSize: 15,
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
    color: INK,
    fontSize: 20,
    fontWeight: '700',
  },
  resultCount: {
    color: MUTED,
    fontSize: 14,
  },
  clearText: {
    color: GREEN,
    fontSize: 15,
  },
  resultCard: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 13,
    marginBottom: 10,
  },
  pillIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicineInfo: {
    flex: 1,
    paddingVertical: 12,
  },
  medicineName: {
    color: INK,
    fontWeight: '700',
  },
  medicineDetail: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  recentList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 14,
  },
  recentItem: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ECEEF1',
  },
  recentText: {
    flex: 1,
    color: INK,
    marginLeft: 10,
  },
  emptyCard: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 20,
  },
  emptyText: {
    color: INK,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  emptySubtext: {
    color: MUTED,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 6,
  },
  note: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 15,
  },
});