import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './HomeScreen';
import SearchScreen, {
  type CaptureAction,
  type SearchHistoryEntry,
} from './SearchScreen';
import MedicationListScreen from './MedicationListScreen';
import FamilyScreen from './FamilyScreen';
import MyInfoScreen from './MyInfoScreen';

// 하단 탭 메뉴와 탭 이름 타입
const tabs = [
  { label: '홈', icon: 'home-outline' },
  { label: '검색', icon: 'search-outline' },
  { label: '복용 목록', icon: 'list-outline' },
  { label: '가족', icon: 'people-outline' },
  { label: '내 정보', icon: 'person-outline' },
] as const;

type TabName = (typeof tabs)[number]['label'];

// 메인 탭 전환과 검색 기록 상태 관리
export default function MainScreens() {
  // 현재 탭과 최근 검색 기록, 홈에서 시작한 촬영 요청
  const [activeTab, setActiveTab] = useState<TabName>('홈');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([]);
  const [pendingCaptureAction, setPendingCaptureAction] = useState<CaptureAction | null>(null);
  const [captureOriginTab, setCaptureOriginTab] = useState<TabName | null>(null);
  const [pendingSearchQuery, setPendingSearchQuery] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  // 홈은 유지하고, 투명한 검색 화면이 네이티브 촬영/사진 선택 동작만 처리합니다.
  function openSearchCapture(action: CaptureAction) {
    setCaptureOriginTab(activeTab);
    setPendingCaptureAction(action);
  }

  function closeHomeCapture() {
    setCaptureOriginTab(null);
  }

  // 홈 검색 입력을 검색 탭에 전달합니다.
  function openSearchWithQuery(query: string) {
    setPendingSearchQuery(query);
    setActiveTab('검색');
  }

  // 검색 기록 추가 및 중복 기록 정리
  function saveSearch(entry: SearchHistoryEntry) {
    setRecentSearches(current => [
      entry,
      ...current.filter(item => item.query.toLocaleLowerCase() !== entry.query.toLocaleLowerCase()),
    ].slice(0, 12));
  }

  function deleteSearch(query: string) {
    setRecentSearches(current => current.filter(
      item => item.query.toLocaleLowerCase() !== query.toLocaleLowerCase(),
    ));
  }

  // 선택된 탭에 맞는 본문 화면 반환
  function renderScreen() {
    switch (activeTab) {
      case '검색':
        return (
          <SearchScreen
            pendingCaptureAction={pendingCaptureAction}
            onCaptureActionHandled={() => setPendingCaptureAction(null)}
            onCaptureClosed={closeHomeCapture}
            initialQuery={pendingSearchQuery}
            onInitialQueryHandled={() => setPendingSearchQuery(null)}
            recentSearches={recentSearches}
            onSaveSearch={saveSearch}
            onDeleteSearch={deleteSearch}
            onClearSearches={() => setRecentSearches([])}
          />
        );
      case '복용 목록':
        return <MedicationListScreen />;
      case '가족':
        return <FamilyScreen />;
      case '내 정보':
        return <MyInfoScreen />;
      default:
        return (
          <HomeScreen
            onPressCaptureAction={openSearchCapture}
            onPressSearch={openSearchWithQuery}
          />
        );
    }
  }

  // 화면 본문과 하단 탭 바
  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>

      {/* 홈 촬영 요청을 처리하는 숨김 화면: 탭 전환 없이 시스템 카메라/사진 창만 띄웁니다. */}
      {activeTab === '홈' && captureOriginTab === '홈' && (
        <View style={styles.captureHost} pointerEvents="none">
          <SearchScreen
            pendingCaptureAction={pendingCaptureAction}
            onCaptureActionHandled={() => setPendingCaptureAction(null)}
            onCaptureClosed={closeHomeCapture}
            recentSearches={recentSearches}
            onSaveSearch={saveSearch}
            onDeleteSearch={deleteSearch}
            onClearSearches={() => setRecentSearches([])}
          />
        </View>
      )}

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {tabs.map(tab => {
          const selected = activeTab === tab.label;
          const iconName = selected
            ? tab.icon.replace('-outline', '')
            : tab.icon;

          return (
            <Pressable
              key={tab.label}
              style={styles.tab}
              onPress={() => setActiveTab(tab.label)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              <Ionicons
                name={iconName as React.ComponentProps<typeof Ionicons>['name']}
                size={25}
                color={selected ? '#39A887' : '#9AA1AA'}
              />
              <Text style={[styles.label, selected && styles.selectedLabel]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// 메인 화면과 탭 바 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  screen: {
    flex: 1,
  },
  captureHost: {
    ...StyleSheet.absoluteFill,
    opacity: 0,
  },
  tabBar: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
label: {
    color: '#9AA1AA',
    fontFamily: 'Pretendard',
    fontSize: 20,
    },
  selectedLabel: {
    color: '#39A887',
    fontWeight: '700',
  },
});
