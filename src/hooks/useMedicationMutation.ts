import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export function useMedicationMutation() {
  const { withSession } = useAuth();
  const request = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => () => request.current?.abort(), []);

  async function run(action: (token: string, signal: AbortSignal) => Promise<unknown>) {
    if (request.current) return false;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(undefined);
    try {
      await withSession(token => action(token, controller.signal), controller.signal);
      return !controller.signal.aborted;
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : '복약 정보를 저장하지 못했어요.');
      return false;
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return { busy, error, run, clearError: () => setError(undefined) };
}
