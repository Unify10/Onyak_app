import { useCallback } from 'react';
import { useIsFocused } from 'expo-router';
import { getFamilyProfile } from '../api/family';
import { useAuth } from '../providers/AuthProvider';
import { useProtectedQuery } from './useProtectedQuery';

export function useWardProfile() {
  const { dependentId } = useAuth();
  const isFocused = useIsFocused();
  const query = useCallback((token: string, signal: AbortSignal) => {
    if (dependentId === null) throw new Error('피보호자 계정으로 로그인해 주세요.');
    return getFamilyProfile(dependentId, token, signal);
  }, [dependentId]);

  return useProtectedQuery(query, isFocused, 'dependent');
}
