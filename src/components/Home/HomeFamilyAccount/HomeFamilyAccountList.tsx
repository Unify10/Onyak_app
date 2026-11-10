import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useFamilies } from '../../../providers/FamilyProvider';
import HomeFamilyAccountItem from './HomeFamilyAccountItem';

export default function HomeFamilyAccountList() {
  const styles = useResponsiveStyles(baseStyles);
  const { families } = useFamilies();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>가족 계정</Text>
        <Pressable onPress={() => router.push('/family')} accessibilityRole="button" accessibilityLabel="가족 계정 관리" hitSlop={8}><Text style={styles.manage}>관리</Text></Pressable>
      </View>
      {families.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>{families.map(family => <HomeFamilyAccountItem key={family.id} familyAccountName={family.details.name} />)}</ScrollView> : <View style={styles.empty}><Text style={styles.emptyText}>등록된 가족이 없습니다.</Text><Text style={styles.emptyDescription}>가족 페이지에서 가족 계정을 추가해주세요.</Text></View>}
    </View>
  );
}
const baseStyles = StyleSheet.create({
  container: { gap: 14, width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, color: '#111111' }, manage: { fontSize: 16, color: '#6B7280' },
  list: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
  empty: { paddingVertical: 22, alignItems: 'center', gap: 6 },
  emptyText: { color: '#6B7280', fontSize: 15 }, emptyDescription: { color: '#9CA3AF', fontSize: 13, lineHeight: 20, textAlign: 'center' },
});
