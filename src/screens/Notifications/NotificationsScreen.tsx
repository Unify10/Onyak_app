import Text from '../../components/Typography/Text';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationCard from '../../components/Notifications/NotificationCard';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { typography } from '../../theme/tokens';
import { notificationExamples } from './notificationExamples';
import { useEffect } from 'react';
import { useNotifications } from '../../providers/NotificationProvider';

export default function NotificationsScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { markAllRead } = useNotifications();
  useEffect(() => { markAllRead(); }, [markAllRead]);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/')} accessibilityRole="button" accessibilityLabel="홈으로 돌아가기" style={styles.backButton}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
        <Text style={styles.title}>알림 내역</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {notificationExamples.map(group => (
          <View key={group.label} style={styles.group}>
            <Text style={styles.groupTitle}>{group.label}</Text>
            <View style={styles.list}>{group.items.map(notification => <NotificationCard key={notification.id} notification={notification} />)}</View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.pageTitle },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 24 },
  group: { gap: 10 }, groupTitle: { color: '#6B7280', fontSize: 16, lineHeight: 24 }, list: { gap: 14 },
});
