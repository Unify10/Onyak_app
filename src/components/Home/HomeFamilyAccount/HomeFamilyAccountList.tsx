import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { useFamilies } from '../../../providers/FamilyProvider';
import { getFamilyList } from '../../../api/family';
import { useProtectedQuery } from '../../../hooks/useProtectedQuery';
import QueryError from '../../Feedback/QueryError';
import ListSkeleton from '../../Skeleton/ListSkeleton';
import HomeFamilyAccountItem from './HomeFamilyAccountItem';

export default function HomeFamilyAccountList() {
  const styles = useResponsiveStyles(baseStyles);
  const { families } = useFamilies();
  const { state, retry } = useProtectedQuery(getFamilyList, useIsFocused());
  const accounts = [
    ...(state.status === 'ready' ? state.data.map(family => ({ id: String(family.ward_id), name: family.name })) : []),
    ...families.map(family => ({ id: family.id, name: family.details.name })),
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>가족 계정</Text>
        <Pressable onPress={() => router.push('/family')} accessibilityRole="button" accessibilityLabel="가족 계정 관리" hitSlop={8}><Text style={styles.manage}>관리</Text></Pressable>
      </View>
      {state.status === 'loading' && <ListSkeleton label="가족 계정 불러오는 중" layout="avatars" />}
      {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {accounts.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
          {accounts.map(account => (
            <HomeFamilyAccountItem
              key={account.id}
              familyAccountName={account.name}
              onPress={() => router.push({ pathname: '/family/[id]', params: { id: account.id } })}
            />
          ))}
        </ScrollView>
      )}
      {state.status === 'ready' && accounts.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>등록된 가족이 없습니다.</Text>
          <Text style={styles.emptyDescription}>가족 페이지에서 가족 계정을 추가해주세요.</Text>
        </View>
      )}
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
