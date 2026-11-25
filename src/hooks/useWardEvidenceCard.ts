import { useCallback } from 'react';
import { useIsFocused } from 'expo-router';
import { getEvidenceCard } from '../api/evidenceCard';
import { useProtectedQuery } from './useProtectedQuery';

export function useWardEvidenceCard(id: string | undefined, role: 'guardian' | 'dependent', revision?: number) {
  const isFocused = useIsFocused();
  const query = useCallback((token: string, signal: AbortSignal) => {
    if (!id) throw new Error('피보호자 정보를 확인하지 못했어요.');
    return getEvidenceCard(id, token, signal);
  }, [id]);
  return useProtectedQuery(query, Boolean(id) && isFocused, role, revision);
}
