import { useEffect, useState } from 'react';
import { ApiError } from '../api/client';
import { useAuth } from '../providers/AuthProvider';

type QueryState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'error'; message: string; httpStatus?: number };

export function useProtectedQuery<T>(
  query: (accessToken: string, signal: AbortSignal) => Promise<T>,
  enabled = true,
  role: 'guardian' | 'dependent' = 'guardian',
) {
  const { isAuthenticated, dependentId, withSession } = useAuth();
  const canQuery = enabled && (role === 'guardian' ? isAuthenticated : dependentId !== null);
  const [snapshot, setSnapshot] = useState<{ query: typeof query; attempt: number; result: QueryState<T> } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!canQuery) return;
    const controller = new AbortController();
    void withSession(token => query(token, controller.signal), controller.signal).then(data => {
      if (!controller.signal.aborted) setSnapshot({ query, attempt, result: { status: 'ready', data } });
    }).catch(error => {
      if (!controller.signal.aborted) {
        setSnapshot({ query, attempt, result: {
          status: 'error',
          httpStatus: error instanceof ApiError ? error.status : undefined,
          message: error instanceof Error ? error.message : '정보를 불러오지 못했어요.',
        } });
      }
    });

    return () => controller.abort();
  }, [attempt, canQuery, query, withSession]);

  function retry() {
    setAttempt(current => current + 1);
  }

  const state: QueryState<T> = canQuery && snapshot?.query === query && snapshot.attempt === attempt
    ? snapshot.result
    : { status: 'loading' };
  return { state, retry };
}
