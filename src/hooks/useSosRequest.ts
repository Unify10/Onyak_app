import { useEffect, useRef, useState } from 'react';
import { sendSosRequest } from '../api/notifications';
import { useAuth } from '../providers/AuthProvider';

export function useSosRequest() {
  const { dependentId, withSession } = useAuth();
  const request = useRef<AbortController | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => () => request.current?.abort(), []);

  async function send() {
    if (!dependentId || request.current || sent) return;
    const controller = new AbortController();
    request.current = controller;
    setSending(true);
    setError(undefined);
    try {
      await withSession(token => sendSosRequest(token, controller.signal), controller.signal);
      if (!controller.signal.aborted) setSent(true);
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : 'SOS 전송 결과를 확인하지 못했어요.');
      }
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setSending(false);
    }
  }

  return { sending, sent, error, send };
}
