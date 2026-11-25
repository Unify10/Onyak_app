import { useEffect, useRef, useState } from 'react';
import { reissueWardInvitation } from '../api/wardAuth';
import { useAuth } from '../providers/AuthProvider';

export function useWardInvitation(wardId: number) {
  const { wardInvitations, rememberWardInvitation, withSession } = useAuth();
  const request = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => () => request.current?.abort(), []);

  async function reissue() {
    if (request.current) return false;

    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(undefined);
    try {
      const invitation = await withSession(token => reissueWardInvitation(wardId, token, controller.signal), controller.signal);
      if (controller.signal.aborted) return false;
      rememberWardInvitation(wardId, invitation);
      return true;
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(cause instanceof Error ? cause.message : '연동 코드를 다시 발급하지 못했어요.');
      }
      return false;
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return { invitation: wardInvitations.get(wardId), busy, error, reissue };
}
