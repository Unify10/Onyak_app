import Text from '../../components/Typography/Text';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationCard from '../../components/Notifications/NotificationCard';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { typography } from '../../theme/tokens';
import { notificationExamples } from './notificationExamples';
import { useEffect, useState } from 'react';
import { useNotifications } from '../../providers/NotificationProvider';

export default function NotificationsScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const [filter, setFilter] = useState<'all' | 'medication' | 'sos'>('all');
  const { markAllRead } = useNotifications();
  useEffect(() => { markAllRead(); }, [markAllRead]);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} accessibilityRole="button" accessibilityLabel="홈으로 돌아가기" style={styles.backButton}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
        <Text style={styles.title}>알림 내역</Text>
      </View>
      <View style={styles.filters}>
        {([{ id: 'all', label: '전체' }, { id: 'medication', label: '복용 알림' }, { id: 'sos', label: '긴급 알림' }] as const).map(option => (
          <Pressable key={option.id} onPress={() => setFilter(option.id)} accessibilityRole="button" accessibilityState={{ selected: filter === option.id }} style={[styles.filterButton, filter === option.id && styles.activeFilterButton]}>
            <Text style={[styles.filterText, filter === option.id && styles.activeFilterText]}>{option.label}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notificationExamples.map(group => {
          const items = group.items.filter(item => filter === 'all' || item.type === filter);
          if (!items.length) return null;
          return <View key={group.label} style={styles.group}>
            <Text style={styles.groupTitle}>{group.label}</Text>
            <View style={styles.list}>{items.map(notification => <NotificationCard key={notification.id} notification={notification} />)}</View>
          </View>;
        })}
      </ScrollView>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.pageTitle },
  filters: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  filterButton: { minHeight: 36, borderRadius: 18, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  activeFilterButton: { borderColor: '#111111', backgroundColor: '#111111' },
  filterText: { color: '#4B5563', fontSize: 13, fontWeight: '600' },
  activeFilterText: { color: '#FFFFFF' },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 24 },
  group: { gap: 10 }, groupTitle: { color: '#6B7280', fontSize: 16, lineHeight: 24 }, list: { gap: 14 },
});
