import Text from '../Typography/Text';
import SkeletonBlock from '../Skeleton/SkeletonBlock';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { calculateAge, isValidBirthDate, type PersonalInfo } from '../../utils/personalInfo';

type Props = { profile?: PersonalInfo; showBirthDate?: boolean; loading?: boolean };

export default function ProfileInfoTable({ profile, showBirthDate = false, loading = false }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const [today] = useState(() => new Date());
  const age = profile?.age || calculateAge(profile?.birthDate ?? '', today);
  const birthDate = profile?.birthDate ?? '';
  const rows = [
    ['성별', profile?.gender],
    ['연령', age ? `만 ${Number(age)}세` : '미입력'],
    ...(showBirthDate && (!profile || isValidBirthDate(birthDate, today.getTime())) ? [['생년월일', birthDate]] : []),
    ['신장', profile?.height ? `${profile.height} cm` : profile?.heightUnavailable ? '조회 불가' : '미입력'],
    ['몸무게', profile?.weight ? `${profile.weight} kg` : '미입력'],
    ['임신 여부', profile?.pregnant ? '임신 중' : profile?.pregnancyStatusProvided || profile?.gender === '남성' ? '해당 없음' : '미입력'],
  ];
  return (
    <View style={styles.table}>
      {rows.map(([label, value], index) => (
        <View key={label} style={[styles.row, index > 0 && styles.border]}>
          <Text style={styles.label}>{label}</Text>
          {loading ? <SkeletonBlock style={styles.valueSkeleton} /> : <Text style={styles.value}>{profile ? value : '—'}</Text>}
        </View>
      ))}
    </View>
  );
}
const baseStyles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden' },
  row: { minHeight: 46, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  valueSkeleton: { width: 68, height: 14 },
  label: { color: '#6B7280', fontSize: 14 }, value: { color: '#111111', fontSize: 14 },
});
