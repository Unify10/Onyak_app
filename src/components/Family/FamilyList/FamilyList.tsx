import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';
import FamilyItem from './FamilyItem';
import { useFamilies } from '../../../providers/FamilyProvider';

export default function FamilyList() {
  const styles = useResponsiveStyles(baseStyles);
  const { families } = useFamilies();
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>가족</Text><Text style={styles.count}>{families.length}명</Text></View>
      <View style={styles.list}>
        {families.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>등록된 가족이 없습니다.</Text><Text style={styles.emptyDescription}>가족 계정 생성으로 피보호자 정보를 입력해주세요.</Text></View> : families.map(family => <FamilyItem key={family.id} familyItemName={family.details.name} familyItemEmail="테스트 계정 · 연동 대기" />)}
      </View>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  container: { width: '100%', gap: 12 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, color: '#111111' }, count: { fontSize: 14, color: '#6B7280' }, list: { gap: 10 },
  empty: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 15, padding: 24, alignItems: 'center', gap: 8 },
  emptyTitle: { color: '#111111', fontSize: 16 }, emptyDescription: { color: '#6B7280', fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
