import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileHero({ name, email }: { name: string; email: string }) {
  const styles = useResponsiveStyles(baseStyles);
  return <View style={styles.container}><View style={styles.avatar}><Ionicons name="person" size={48} color="#111111" /></View><Text style={styles.name}>{name}</Text><Text style={styles.email}>{email || '이메일 계정'}</Text></View>;
}
const baseStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 20, paddingBottom: 22 },
  avatar: { width: 82, height: 82, borderRadius: 41, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F5F5' },
  name: { fontSize: 20, lineHeight: 28, marginTop: 16, color: '#111111' },
  email: { fontSize: 13, lineHeight: 20, marginTop: 2, color: '#6B7280' },
});
