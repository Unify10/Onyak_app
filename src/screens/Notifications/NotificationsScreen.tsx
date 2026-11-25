import { getNotifications, NOTIFICATION_PAGE_SIZE } from '../../api/notifications';
import QueryError from '../../components/Feedback/QueryError';
import type { NotificationEntry } from '../../components/Notifications/NotificationCard';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { getLocalDateKey } from '../../utils/medicationSchedule';
import Text from '../../components/Typography/Text';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { typography } from '../../theme/tokens';
import { lazy, Suspense, useCallback, useState } from 'react';

const NotificationCard = lazy(() => import('../../components/Notifications/NotificationCard'));

export default function NotificationsScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const [filter, setFilter] = useState<'all' | 'medication' | 'sos'>('all');
  const [page, setPage] = useState(0);
  const query = useCallback((token: string, signal: AbortSignal) => getNotifications(token, signal, page), [page]);
  const { state, retry } = useProtectedQuery(query);
  const groups = new Map<string, NotificationEntry[]>();
  const notifications = state.status === 'ready' ? state.data : [];
  const today = getLocalDateKey(new Date());
  for (const item of notifications) {
    const type = item.type === 'SOS' ? 'sos' : item.type === 'MED_REMINDER' ? 'medication' : 'warning';
    if (filter !== 'all' && type !== filter) continue;

    const date = new Date(item.created_at);
    const dateLabel = Number.isNaN(date.getTime()) ? '날짜 미상'
      : getLocalDateKey(date) === today ? '오늘'
      : date.toLocaleDateString('ko-KR');
    const title = type === 'sos' ? 'SOS 긴급 알림' : type === 'medication' ? '복용 알림' : '주의 알림';
    const group = groups.get(dateLabel) ?? [];
    group.push({ id: String(item.id), type, title, body: item.message });
    groups.set(dateLabel, group);
  }

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
        {state.status === 'loading' && <ListSkeleton label="알림 내역 불러오는 중" />}
        {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
        {state.status === 'ready' && (
          <Suspense fallback={<ListSkeleton label="알림 내역 불러오는 중" />}>
            <View style={styles.groups}>
              {groups.size === 0 && <Text style={styles.empty}>표시할 알림이 없어요.</Text>}
              {[...groups].map(([label, notifications]) => (
                <View key={label} style={styles.group}>
                  <Text style={styles.groupTitle}>{label}</Text>
                  <View style={styles.list}>
                    {notifications.map(notification => <NotificationCard key={notification.id} notification={notification} />)}
                  </View>
                </View>
              ))}
              {(page > 0 || notifications.length === NOTIFICATION_PAGE_SIZE) && (
                <View style={styles.pagination}>
                  {page > 0 && (
                    <Pressable accessibilityRole="button" style={styles.pageControl} onPress={() => setPage(page - 1)}>
                      <Text style={styles.filterText}>이전 알림</Text>
                    </Pressable>
                  )}
                  {notifications.length === NOTIFICATION_PAGE_SIZE && (
                    <Pressable accessibilityRole="button" style={styles.pageControl} onPress={() => setPage(page + 1)}>
                      <Text style={styles.filterText}>다음 알림</Text>
                    </Pressable>
                  )}
                </View>
              )}
            </View>
          </Suspense>
        )}
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
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  groups: { gap: 24 },
  empty: { color: '#6B7280', paddingVertical: 24, textAlign: 'center' },
  pagination: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  pageControl: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12 },
  group: { gap: 10 }, groupTitle: { color: '#6B7280', fontSize: 16, lineHeight: 24 }, list: { gap: 14 },
});
