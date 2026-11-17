import Text from '../Typography/Text';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

export type NotificationEntry = { id: string; type: 'medication' | 'sos'; title: string; body: string };
export default function NotificationCard({ notification }: { notification: NotificationEntry }) {
  const styles = useResponsiveStyles(baseStyles);
  const isSos = notification.type === 'sos';
  return (
    <View style={[styles.card, isSos && styles.sosCard]}>
      <View style={[styles.iconBadge, isSos && styles.sosIconBadge]}><Ionicons name={isSos ? 'alert-circle' : 'notifications-outline'} size={styles.icon.width} color={isSos ? '#D92D20' : '#111111'} /></View>
      <View style={styles.text}><View style={styles.titleRow}><Text style={[styles.title, isSos && styles.sosTitle]}>{notification.title}</Text>{isSos && <View style={styles.sosLabel}><Text style={styles.sosLabelText}>긴급</Text></View>}</View><Text style={styles.body}>{notification.body}</Text></View>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  card: { minHeight: 72, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  sosCard: { borderColor: '#F04438', borderWidth: 1.5, backgroundColor: '#FFF5F4' },
  iconBadge: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  sosIconBadge: { backgroundColor: '#FEE4E2' },
  icon: { width: 26 }, text: { flex: 1 }, titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, title: { color: '#111111', fontSize: 16, lineHeight: 22, fontWeight: '600' }, sosTitle: { color: '#B42318' },
  sosLabel: { borderRadius: 10, backgroundColor: '#D92D20', paddingHorizontal: 8, paddingVertical: 2 }, sosLabelText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  body: { color: '#111111', fontSize: 14, lineHeight: 21, marginTop: 2 },
});
