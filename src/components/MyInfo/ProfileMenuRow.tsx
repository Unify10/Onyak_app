import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = { label: string; icon?: React.ComponentProps<typeof Ionicons>['name']; onPress: () => void; last?: boolean; logout?: boolean; destructive?: boolean };
export default function ProfileMenuRow({ label, icon, onPress, last = false, logout = false, destructive = false }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, !last && styles.border]}>{icon && <Ionicons name={icon} size={21} color="#000000" />}<Text style={[styles.label, destructive && styles.destructiveLabel]}>{label}</Text><Ionicons name={logout ? 'log-out-outline' : 'chevron-forward'} size={20} color="#C4C8CF" /></Pressable>;
}
const baseStyles = StyleSheet.create({
  row: { minHeight: 54, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB' },
  destructiveLabel: { color: '#D92D20' },
  label: { flex: 1, fontSize: 16, color: '#111111', lineHeight: 24 },
});
