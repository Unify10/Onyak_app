import { useIsFocused } from 'expo-router';
import { getFamilyList } from '../../../api/family';
import { useProtectedQuery } from '../../../hooks/useProtectedQuery';
import QueryError from '../../Feedback/QueryError';
import FamilyListLayout from './FamilyListLayout';
import ServerFamilyItem from './ServerFamilyItem';
import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';
import FamilyItem from './FamilyItem';
import { useFamilies } from '../../../providers/FamilyProvider';

export default function FamilyList() {
  const styles = useResponsiveStyles(baseStyles);
  const { families, removeFamily } = useFamilies();
  const { state, retry } = useProtectedQuery(getFamilyList, useIsFocused());
  const remoteFamilies = state.status === 'ready' ? state.data : [];
  return (
    <FamilyListLayout count={state.status === 'ready' ? families.length + remoteFamilies.length : undefined} loading={state.status === 'loading'}>
      {state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {remoteFamilies.map(family => <ServerFamilyItem key={family.ward_id} family={family} />)}
      {families.map(family => <FamilyItem key={family.id} family={family} onDelete={removeFamily} />)}
      {state.status === 'ready' && families.length === 0 && remoteFamilies.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>등록된 가족이 없습니다.</Text>
          <Text style={styles.emptyDescription}>가족 계정을 추가해주세요.</Text>
        </View>
      )}
    </FamilyListLayout>
  );
}

const baseStyles = StyleSheet.create({
  empty: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 12, alignItems: 'center', gap: 4 },
  emptyTitle: { color: '#111111', fontSize: 14, lineHeight: 20 }, emptyDescription: { color: '#6B7280', fontSize: 13, lineHeight: 18, textAlign: 'center' },
});
