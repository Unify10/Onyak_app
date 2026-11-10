import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { isValidBirthDate, type PersonalInfo } from '../../utils/personalInfo';

export default function ProfileInfoTable({ profile }: { profile: PersonalInfo }) {
  const styles = useResponsiveStyles(baseStyles);
  const [today] = useState(() => new Date());
  let age = profile.age ? `만 ${Number(profile.age)}세` : '미입력';
  if (!profile.age && isValidBirthDate(profile.birthDate, today.getTime())) {
    const birthday = new Date(`${profile.birthDate}T00:00:00`);
    const hadBirthday = today.getMonth() > birthday.getMonth() || (today.getMonth() === birthday.getMonth() && today.getDate() >= birthday.getDate());
    age = `만 ${today.getFullYear() - birthday.getFullYear() - (hadBirthday ? 0 : 1)}세`;
  }
  const rows = [ ['성별', profile.gender], ['연령', age], ['신장', profile.height ? `${profile.height} cm` : '미입력'], ['몸무게', profile.weight ? `${profile.weight} kg` : '미입력'], ['임신 여부', profile.pregnant ? '임신 중' : '해당 없음'] ];
  return <View style={styles.table}>{rows.map(([label, value], index) => <View key={label} style={[styles.row, index > 0 && styles.border]}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>)}</View>;
}
const baseStyles = StyleSheet.create({
  table: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, overflow: 'hidden' },
  row: { minHeight: 46, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  border: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  label: { color: '#6B7280', fontSize: 14 }, value: { color: '#111111', fontSize: 14 },
});
