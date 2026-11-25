import { useCallback } from 'react';
import { getMedicationCalendar } from '../api/medications';
import { useProtectedQuery } from './useProtectedQuery';
import { getLocalDateKey } from '../utils/medicationSchedule';

export function useWardCalendar(wardId: string | undefined, month: Date, role: 'guardian' | 'dependent', revision?: number) {
  const monthKey = getLocalDateKey(month).slice(0, 7);
  const query = useCallback((token: string, signal: AbortSignal) => (
    wardId ? getMedicationCalendar(wardId, monthKey, token, signal) : Promise.resolve([])
  ), [wardId, monthKey]);
  return useProtectedQuery(query, Boolean(wardId), role, revision);
}
