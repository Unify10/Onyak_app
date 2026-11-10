import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { Link, usePathname, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../../../assets/tabs/home.svg';
import SearchIcon from '../../../assets/tabs/search.svg';
import MedicationListIcon from '../../../assets/tabs/medication-list.svg';
import FamilyIcon from '../../../assets/tabs/family.svg';
import ProfileIcon from '../../../assets/tabs/profile.svg';

export type TabLabel = '홈' | '검색' | '복용 목록' | '가족' | '내 정보';

const tabs = [
  { label: '홈', href: '/(tabs)' as Href, Icon: HomeIcon },
  { label: '검색', href: '/(tabs)/search' as Href, Icon: SearchIcon },
  { label: '복용 목록', href: '/(tabs)/medication-list' as Href, Icon: MedicationListIcon },
  { label: '가족', href: '/(tabs)/family' as Href, Icon: FamilyIcon },
  { label: '내 정보', href: '/(tabs)/my-info' as Href, Icon: ProfileIcon },
] as const;

export default function BottomTabBar() {
  const styles = useResponsiveStyles(baseStyles);
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map(({ label, href, Icon }) => {
        const isActive = label === '홈'
          ? pathname === '/' || pathname === '/index' || pathname === '/notifications'
          : (label === '내 정보' && ['/edit-profile', '/change-password', '/delete-account'].includes(pathname)) || (label === '검색' && pathname.startsWith('/medicine/')) || pathname.endsWith(href.toString().split('/').at(-1) ?? '');
        return (
          <Link key={label} href={href} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isActive }}
              style={styles.tab}
            >
              <Icon width={20} height={20} color={isActive ? '#000000' : '#9CA3AF'} />
              <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    minHeight: 64,
    paddingHorizontal: 16,
    paddingTop: 8,
    width: '100%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  activeLabel: {
    color: '#000000',
    fontWeight: '600',
  },
});
