import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import type { FamilySummary } from '../../../api/family';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { colors } from '../../../theme/tokens';
import Text from '../../Typography/Text';

type Props = { family: FamilySummary };

export default function ServerFamilyItem({ family }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${family.name} 상세 정보 보기`}
      onPress={() => router.push({ pathname: '/family/[id]', params: { id: String(family.ward_id) } })}
      style={styles.row}
    >
      <View style={styles.avatar}><Ionicons name="person" size={24} color={colors.muted} /></View>
      <Text style={styles.name}>{family.name}</Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const baseStyles = StyleSheet.create({
  row: { borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontSize: 18, lineHeight: 24, color: colors.ink },
});
