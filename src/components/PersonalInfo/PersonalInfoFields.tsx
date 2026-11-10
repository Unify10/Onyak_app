import Text from '../Typography/Text';
import TextInput from '../Typography/TextInput';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, Switch, View, Pressable } from 'react-native';
import BirthDateField from './BirthDateField';
import type { PersonalInfo } from '../../utils/personalInfo';

type Props = { value: PersonalInfo; onChange: (value: PersonalInfo) => void; showBirthDate?: boolean; showAge?: boolean; familyLayout?: boolean };
export default function PersonalInfoFields({ value, onChange, showBirthDate = false, showAge = false, familyLayout = false }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  function update<K extends keyof PersonalInfo>(key: K, next: PersonalInfo[K]) { onChange({ ...value, [key]: next }); }
  const pregnancyField = <View style={styles.field}><Text style={styles.label}>임신</Text><View style={[styles.switchRow, value.gender === '남성' && styles.disabled]}><Text style={styles.label}>임신 여부</Text><Switch accessibilityLabel="임신 여부" disabled={value.gender === '남성'} value={value.pregnant} onValueChange={next => update('pregnant', next)} trackColor={{ false: '#D1D5DB', true: '#80A96C' }} /></View></View>;
  return (
    <View style={styles.fields}>
      {showBirthDate && <View style={styles.field}><Text style={styles.label}>생년월일</Text><BirthDateField value={value.birthDate} onChange={next => update('birthDate', next)} /></View>}
      <View style={styles.field}><Text style={styles.label}>이름</Text><TextInput accessibilityLabel="이름" value={value.name} onChangeText={next => update('name', next)} placeholder="이름을 입력해주세요." placeholderTextColor="#9CA3AF" style={styles.input} maxLength={40} /></View>
      {showAge && <View style={styles.field}><Text style={styles.label}>연령 (만 나이)</Text><TextInput accessibilityLabel="연령" value={value.age} onChangeText={next => update('age', next)} keyboardType="number-pad" maxLength={3} placeholder="예시) 30" placeholderTextColor="#9CA3AF" style={styles.input} /></View>}
      <View style={styles.field}><Text style={styles.label}>성별</Text><View style={styles.genderRow}>{(['여성', '남성', '선택 안함'] as const).map(gender => <Pressable key={gender} accessibilityRole="radio" accessibilityState={{ selected: gender === value.gender }} onPress={() => onChange({ ...value, gender, pregnant: gender === '남성' ? false : value.pregnant })} style={[styles.gender, value.gender === gender && styles.selected]}><Text style={[styles.genderText, value.gender === gender && styles.selectedText]}>{gender}</Text></Pressable>)}</View></View>
      {familyLayout && pregnancyField}
      <View style={[styles.measurements, familyLayout && styles.vertical]}>
        <View style={styles.measurement}><Text style={styles.label}>신장 (cm)</Text><TextInput accessibilityLabel="신장" keyboardType="decimal-pad" value={value.height} onChangeText={next => update('height', next)} placeholder="예시) 160" placeholderTextColor="#9CA3AF" style={styles.input} maxLength={6} /></View>
        <View style={styles.measurement}><Text style={styles.label}>몸무게 (kg)</Text><TextInput accessibilityLabel="몸무게" keyboardType="decimal-pad" value={value.weight} onChangeText={next => update('weight', next)} placeholder="예시) 50" placeholderTextColor="#9CA3AF" style={styles.input} maxLength={6} /></View>
      </View>
      {!familyLayout && pregnancyField}
    </View>
  );
}
const baseStyles = StyleSheet.create({
  fields: { gap: 20 }, field: { gap: 8 }, label: { fontSize: 16, lineHeight: 24, color: '#111111' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, color: '#111111', fontSize: 16 },
  genderRow: { flexDirection: 'row', gap: 12 }, gender: { flex: 1, minHeight: 44, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: '#000000', borderColor: '#000000' }, genderText: { color: '#111111', fontSize: 14 }, selectedText: { color: '#FFFFFF' },
  measurements: { flexDirection: 'row', gap: 16 }, vertical: { flexDirection: 'column', gap: 20 }, measurement: { flex: 1, gap: 8 },
  disabled: { opacity: 0.4 },
  switchRow: { minHeight: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
});
