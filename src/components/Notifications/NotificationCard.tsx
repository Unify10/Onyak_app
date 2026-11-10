import Text from '../Typography/Text';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

export type NotificationEntry = { id: string; type: 'medication' | 'sos'; title: string; body: string };
export default function NotificationCard({ notification }: { notification: NotificationEntry }) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.card}>
      <Ionicons name={notification.type === 'sos' ? 'people' : 'notifications-outline'} size={styles.icon.width} color="#111111" />
      <View style={styles.text}><Text style={styles.title}>{notification.title}</Text><Text style={styles.body}>{notification.body}</Text></View>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  card: { minHeight: 72, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 13, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 26 }, text: { flex: 1 }, title: { color: '#111111', fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: { color: '#111111', fontSize: 14, lineHeight: 21, marginTop: 2 },
});
