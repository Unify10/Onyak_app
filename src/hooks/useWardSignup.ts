import { useEffect, useRef, useState } from 'react';
import { signupWard, type WardInvitation } from '../api/wardAuth';
import { useAuth } from '../providers/AuthProvider';
import type { PersonalInfo } from '../utils/personalInfo';

type SignupState = { status: 'idle' | 'loading' } | { status: 'error'; message: string } | { status: 'success'; invitation: WardInvitation };

export function useWardSignup() {
  const { rememberWardInvitation, withSession } = useAuth();
  const [state, setState] = useState<SignupState>({ status: 'idle' });
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  async function register(details: PersonalInfo) {
    if (pending.current || state.status === 'success') return;
    const controller = new AbortController();
    pending.current = controller;
    setState({ status: 'loading' });
    try {
      const { wardId, invitation } = await withSession(token => signupWard({
        name: details.name.trim(),
        birth_date: details.birthDate,
        weight: Number(details.weight),
        height: Number(details.height),
        gender: details.gender === '남성' ? 'M' : 'F',
        is_pregnant: details.gender === '여성' && details.pregnant,
        medication_push_enabled: true,
        sos_push_enabled: true,
      }, token, controller.signal), controller.signal);
      if (typeof wardId === 'number' && Number.isSafeInteger(wardId) && wardId > 0) {
        rememberWardInvitation(wardId, invitation);
      }
      setState({ status: 'success', invitation });
    } catch (error) {
      if (!controller.signal.aborted) {
        setState({ status: 'error', message: error instanceof Error ? error.message : '가족 계정을 등록하지 못했어요.' });
      }
    } finally {
      pending.current = null;
    }
  }

  return { state, register };
}
