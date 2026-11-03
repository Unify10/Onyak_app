import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar, { type TabLabel } from '../components/BottomTabBar/BottomTabBar';
import Family from './Family/Family';
import Home from './home/Home';
import MedicationList from './MedicationList/MedicationList';
import MyInfo from './MyInfo/MyInfo';
import Search from './Search/Search';
import type { SearchHistoryEntry } from './Search/SearchScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabLabel>('홈');
  const [recentSearches, setRecentSearches] = useState<SearchHistoryEntry[]>([]);

  function saveSearch(entry: SearchHistoryEntry) {
    setRecentSearches(current => [
      entry,
      ...current.filter(
        item => item.query.toLocaleLowerCase() !== entry.query.toLocaleLowerCase(),
      ),
    ].slice(0, 12));
  }

  function deleteSearch(query: string) {
    setRecentSearches(current => current.filter(item => item.query !== query));
  }

  function renderActiveScreen() {
    switch (activeTab) {
      case '검색':
        return (
          <Search
            recentSearches={recentSearches}
            onSaveSearch={saveSearch}
            onDeleteSearch={deleteSearch}
            onClearSearches={() => setRecentSearches([])}
          />
        );
      case '복용 목록':
        return <MedicationList />;
      case '가족':
        return <Family />;
      case '내 정보':
        return <MyInfo />;
      default:
        return <Home />;
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <View style={styles.content}>{renderActiveScreen()}</View>
        <StatusBar style="auto" />
        <BottomTabBar activeTab={activeTab} onTabPress={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, width: '100%' },
});
