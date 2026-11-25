import { useCallback } from 'react';
import { getDrugDur } from '../../api/drugs';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import QueryError from '../Feedback/QueryError';
import Text from '../Typography/Text';
import DrugFindings from './DrugFindings';

export default function DrugDurSection({ drugId }: { drugId: string }) {
  const query = useCallback((token: string, signal: AbortSignal) => getDrugDur(drugId, {}, token, signal), [drugId]);
  const { state, retry } = useProtectedQuery(query);

  if (state.status === 'loading') {
    return <Text accessibilityLiveRegion="polite">금기·주의 정보를 불러오는 중이에요.</Text>;
  }
  if (state.status === 'error') {
    return <QueryError message={state.message} onRetry={retry} />;
  }
  return <DrugFindings findings={state.data} />;
}
