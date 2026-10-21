import { Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../../../assets/home.svg';
import SearchIcon from '../../../assets/search.svg';
import MedicationListIcon from '../../../assets/medication-list.svg';
import FamilyIcon from '../../../assets/family.svg';
import ProfileIcon from '../../../assets/profile.svg';

const tabs = [
  { label: '홈', Icon: HomeIcon },
  { label: '검색', Icon: SearchIcon },
  { label: '복용 목록', Icon: MedicationListIcon },
  { label: '가족', Icon: FamilyIcon },
  { label: '내 정보', Icon: ProfileIcon },
];

export default function BottomTabBar() {
  return (
    <View style={styles.tabBar}>
      {tabs.map(({ label, Icon }) => (
        <Pressable key={label} accessibilityRole="button" style={styles.tab}>
          <Icon width={20} height={20} />
          <Text style={styles.label}>{label}</Text>
        </Pressable>
      ))}
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
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    color: '#667085',
    fontSize: 10,
  }
});