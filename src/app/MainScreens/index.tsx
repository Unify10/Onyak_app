import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import MedicationListScreen from './MedicationListScreen';
import FamilyScreen from './FamilyScreen';
import MyInfoScreen from './MyInfoScreen';

const tabs = [
  { label: '홈', icon: 'home-outline' },
  { label: '검색', icon: 'search-outline' },
  { label: '복용 목록', icon: 'list-outline' },
  { label: '가족', icon: 'people-outline' },
  { label: '내 정보', icon: 'person-outline' },
] as const;

type TabName = (typeof tabs)[number]['label'];

export default function MainScreens() {
  const [activeTab, setActiveTab] = useState<TabName>('홈');
  const insets = useSafeAreaInsets();

  function renderScreen() {
    switch (activeTab) {
      case '검색':
        return <SearchScreen />;
      case '복용 목록':
        return <MedicationListScreen />;
      case '가족':
        return <FamilyScreen />;
      case '내 정보':
        return <MyInfoScreen />;
      default:
        return <HomeScreen />;
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.screen}>{renderScreen()}</View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  screen: {
    flex: 1,
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