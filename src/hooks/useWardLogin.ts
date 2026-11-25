import { useEffect, useRef, useState } from 'react';
import { loginWard, type WardLoginInput } from '../api/wardAuth';
import { useAuth } from '../providers/AuthProvider';

export type WardLoginResult = { success: true; guardianName?: string } | { success: false; message: string };

export function useWardLogin() {
  const { signInDependent } = useAuth();
  const pending = useRef<AbortController | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => () => pending.current?.abort(), []);

  async function submit(input: WardLoginInput): Promise<WardLoginResult> {
    if (pending.current) return { success: false, message: '로그인 요청을 확인하고 있어요.' };
    const controller = new AbortController();
    pending.current = controller;
    try {
      const { session, guardianName } = await loginWard(input, controller.signal);
      setVerified(true);
      signInDependent(session);
      return { success: true, guardianName };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : '피보호자 로그인에 실패했어요.' };
    } finally {
      pending.current = null;
    }
  }

  return { submit, verified };
}
