import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getDrugDur } from '../../api/drugs';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import QueryError from '../Feedback/QueryError';
import Text from '../Typography/Text';
import DrugFindings from './DrugFindings';

export default function DrugDurSection({ drugId }: { drugId: string }) {
  const [open, setOpen] = useState(false);
  const query = useCallback((token: string, signal: AbortSignal) => getDrugDur(drugId, {}, token, signal), [drugId]);
  const { state, retry } = useProtectedQuery(query, open);

  return (
    <View style={styles.section}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen(current => !current)} style={styles.button}>
        <Text style={styles.label}>DUR 금기·주의 조회</Text>
      </Pressable>
      {open && state.status === 'loading' && <Text accessibilityLiveRegion="polite">금기·주의 정보를 불러오는 중이에요.</Text>}
      {open && state.status === 'error' && <QueryError message={state.message} onRetry={retry} />}
      {open && state.status === 'ready' && <DrugFindings findings={state.data} />}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginVertical: 14, gap: 8 },
  button: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#D6DAE0' },
  label: { color: '#171C26', fontSize: 15, fontWeight: '600' },
});
