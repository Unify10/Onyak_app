import Text from '../Typography/Text';
import TextInput from '../Typography/TextInput';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { StyleSheet, View, Pressable } from 'react-native';
import BirthDateField from './BirthDateField';
import { calculateAge, type PersonalInfo } from '../../utils/personalInfo';

type Props = { value: PersonalInfo; onChange: (value: PersonalInfo) => void; showBirthDate?: boolean; showAge?: boolean; familyLayout?: boolean; section?: 'all' | 'personal' | 'body'; spacious?: boolean };
export default function PersonalInfoFields({ value, onChange, showBirthDate = false, showAge = false, familyLayout = false, section = 'all', spacious = false }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  function update<K extends keyof PersonalInfo>(key: K, next: PersonalInfo[K]) { onChange({ ...value, [key]: next }); }
  const pregnancyField = (
    <View style={styles.field}>
      <Text style={styles.label}>{familyLayout ? '임신 여부 *' : '임신 여부'}</Text>
      <View style={styles.genderRow}>
        {([{ value: true, label: '임신 중' }, { value: false, label: '해당 없음' }] as const).map(option => {
          const selected = value.gender === '남성' ? option.value === false : value.pregnancyStatusProvided && value.pregnant === option.value;
          const disabled = value.gender !== '여성';
          return <Pressable key={option.label} accessibilityRole="radio" accessibilityState={{ selected, disabled }} disabled={disabled} onPress={() => onChange({ ...value, pregnant: option.value, pregnancyStatusProvided: true })} style={[styles.gender, selected && styles.selected, disabled && styles.disabled, styles.noFocusOutline]}><Text style={[styles.genderText, selected && styles.selectedText]}>{option.label}</Text></Pressable>;
        })}
      </View>
    </View>
  );
  const genders: PersonalInfo['gender'][] = familyLayout ? ['여성', '남성'] : ['여성', '남성', '선택 안함'];
  const showPersonalFields = section !== 'body';
  const showBodyFields = section !== 'personal';
  const showDemographicFields = section !== 'personal';
  return (
    <View style={[styles.fields, spacious && styles.spaciousFields]}>
      {(showPersonalFields && showBirthDate || section === 'body') && <View style={styles.field}><Text style={styles.label}>생년월일</Text><BirthDateField value={value.birthDate} onChange={next => onChange({ ...value, birthDate: next, age: calculateAge(next) })} /></View>}
      {showPersonalFields && <View style={styles.field}><Text style={styles.label}>{familyLayout ? '이름 *' : '이름'}</Text><TextInput accessibilityLabel="이름" value={value.name} onChangeText={next => update('name', next)} placeholder="이름을 입력해주세요." placeholderTextColor="#9CA3AF" style={styles.input} maxLength={40} /></View>}
      {showDemographicFields && showAge && <View style={styles.field}><Text style={styles.label}>{familyLayout ? '연령 (만 나이) *' : '연령 (만 나이)'}</Text><TextInput accessibilityLabel="연령" value={value.age} onChangeText={next => update('age', next)} keyboardType="number-pad" maxLength={3} placeholder="만 나이" placeholderTextColor="#9CA3AF" style={styles.input} /></View>}
      {showDemographicFields && <View style={styles.field}><Text style={styles.label}>{familyLayout ? '성별 *' : '성별'}</Text><View style={styles.genderRow}>{genders.map(gender => <Pressable key={gender} accessibilityRole="radio" accessibilityState={{ selected: gender === value.gender }} onPress={() => onChange({ ...value, gender, pregnant: gender === '여성' ? value.pregnant : false, pregnancyStatusProvided: gender === '여성' ? (value.gender === '여성' && value.pregnancyStatusProvided) : true })} style={[styles.gender, value.gender === gender && styles.selected, styles.noFocusOutline]}><Text style={[styles.genderText, value.gender === gender && styles.selectedText]}>{gender}</Text></Pressable>)}</View></View>}
      {showBodyFields && (familyLayout || section === 'body' || value.gender === '여성') && pregnancyField}
      {showBodyFields && <View style={[styles.measurements, familyLayout && styles.vertical]}>
        <View style={styles.measurement}><Text style={styles.label}>{familyLayout ? '신장 (cm) *' : '신장 (cm)'}</Text><TextInput accessibilityLabel="신장" keyboardType="decimal-pad" value={value.height} onChangeText={next => update('height', next)} placeholder="cm" placeholderTextColor="#9CA3AF" style={styles.input} maxLength={6} /></View>
        <View style={styles.measurement}><Text style={styles.label}>{familyLayout ? '몸무게 (kg) *' : '몸무게 (kg)'}</Text><TextInput accessibilityLabel="몸무게" keyboardType="decimal-pad" value={value.weight} onChangeText={next => update('weight', next)} placeholder="kg" placeholderTextColor="#9CA3AF" style={styles.input} maxLength={6} /></View>
      </View>}
    </View>
  );
}
const baseStyles = StyleSheet.create({
  fields: { gap: 20 }, spaciousFields: { gap: 24 }, field: { gap: 8 }, label: { fontSize: 16, lineHeight: 24, color: '#111111' },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, color: '#111111', fontSize: 16 },
  genderRow: { flexDirection: 'row', gap: 12 }, gender: { flex: 1, minHeight: 44, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: '#000000', borderColor: '#000000' }, noFocusOutline: { outlineWidth: 0, outlineStyle: 'none' } as any, genderText: { color: '#111111', fontSize: 14 }, selectedText: { color: '#FFFFFF' },
  measurements: { flexDirection: 'row', gap: 16 }, vertical: { flexDirection: 'column', gap: 24 }, measurement: { flex: 1, gap: 8 },
  disabled: { opacity: 0.4 },
});
