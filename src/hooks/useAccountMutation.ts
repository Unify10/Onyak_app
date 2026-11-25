import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export function useAccountMutation(failureMessage: string) {
  const { withSession, isAuthenticated } = useAuth();
  const request = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => request.current?.abort(), []);

  async function run<T>(action: (token: string, signal: AbortSignal) => Promise<T>) {
    if (!isAuthenticated || request.current) return { ok: false } as const;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError('');
    try {
      const data = await withSession(token => action(token, controller.signal), controller.signal);
      if (controller.signal.aborted) return { ok: false } as const;
      return { ok: true, data } as const;
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : failureMessage);
      return { ok: false } as const;
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return { busy, error, run, clearError: () => setError('') };
}
