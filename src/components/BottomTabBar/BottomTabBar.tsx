import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../../../assets/home.svg';
import SearchIcon from '../../../assets/search.svg';
import MedicationListIcon from '../../../assets/medication-list.svg';
import FamilyIcon from '../../../assets/family.svg';
import ProfileIcon from '../../../assets/profile.svg';

type tabLabel = '홈' | '검색' | '복용 목록' | '가족' | '내 정보';

const tabs = [
  { label: '홈', Icon: HomeIcon },
  { label: '검색', Icon: SearchIcon },
  { label: '복용 목록', Icon: MedicationListIcon },
  { label: '가족', Icon: FamilyIcon },
  { label: '내 정보', Icon: ProfileIcon },
] as const;

export default function BottomTabBar() {
  const [activeTab, setActiveTab] = useState<tabLabel>('홈');

  return (
    <View style={styles.tabBar}>
      {tabs.map(({ label, Icon }) => {
        const isActive = activeTab === label;
        return (
          <Pressable
            key={label}
            accessibilityRole="button"
            onPress={()=> setActiveTab(label)}
            style={styles.tab}
          >
            <Icon
              width={20}
              height={20}
              fill={isActive ? '#000000' : '#9CA3AF'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
}     )}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    marginBottom: 0,
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF'
  },
  tab: {
    color: '#9CA3AF',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    color: '#667085',
    fontSize: 10,
  },
  activeLabel: {
    color: '#1D2939',
    fontWeight: '600',
  },
});