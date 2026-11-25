import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import type { FamilySummary } from '../../../api/family';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { colors } from '../../../theme/tokens';
import Text from '../../Typography/Text';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';

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

export function ServerFamilyItemSkeleton() {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View accessible accessibilityLabel="가족 목록 불러오는 중" accessibilityState={{ busy: true }} style={styles.row}>
      <SkeletonBlock style={[styles.avatar, styles.placeholder]} />
      <View style={styles.nameSlot}><SkeletonBlock style={styles.nameSkeleton} /></View>
      <SkeletonBlock style={styles.arrowSkeleton} />
    </View>
  );
}

const baseStyles = StyleSheet.create({
  row: { borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  placeholder: { backgroundColor: '#E7E9ED' },
  nameSlot: { flex: 1 },
  nameSkeleton: { width: '42%', height: 18 },
  arrowSkeleton: { width: 18, height: 16 },
  name: { flex: 1, fontSize: 18, lineHeight: 24, color: colors.ink },
});
