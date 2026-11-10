import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { label: string; icon?: React.ComponentProps<typeof Ionicons>['name']; onPress: () => void; last?: boolean; logout?: boolean };
export default function ProfileMenuRow({ label, icon, onPress, last = false, logout = false }: Props) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, !last && styles.border]}>{icon && <Ionicons name={icon} size={21} color="#000000" />}<Text style={styles.label}>{label}</Text><Ionicons name={logout ? 'log-out-outline' : 'chevron-forward'} size={20} color="#C4C8CF" /></Pressable>;
}
const styles = StyleSheet.create({
  row: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  label: { flex: 1, fontSize: 16, color: '#111111', lineHeight: 24 },
});
