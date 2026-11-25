import { useCallback } from 'react';
import { checkWardMedication } from '../api/medicationSafety';
import { useProtectedQuery } from './useProtectedQuery';

export function useWardMedicationPrecheck(wardId: number, drugId: string) {
  const query = useCallback(
    (token: string, signal: AbortSignal) => checkWardMedication(wardId, drugId, token, signal),
    [wardId, drugId],
  );
  return useProtectedQuery(query);
}
