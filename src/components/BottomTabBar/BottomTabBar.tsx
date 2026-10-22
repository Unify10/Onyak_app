import { Pressable, StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../../../assets/tabs/home.svg';
import SearchIcon from '../../../assets/tabs/search.svg';
import MedicationListIcon from '../../../assets/tabs/medication-list.svg';
import FamilyIcon from '../../../assets/tabs/family.svg';
import ProfileIcon from '../../../assets/tabs/profile.svg';

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
    // marginBottom: 50,
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