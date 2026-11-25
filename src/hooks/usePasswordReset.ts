import { useEffect, useRef, useState } from 'react';
import { resetPassword } from '../api/auth';
import { ApiError } from '../api/client';
import { EMAIL_CODE_LENGTH, EMAIL_PATTERN, useEmailVerification } from './useEmailVerification';

export function usePasswordReset() {
  const [email, setEmail] = useState('');
  const verification = useEmailVerification(email, 'password-reset');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string>();
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  const step = done ? 'done' : verification.verified ? 'password' : verification.sent ? 'code' : 'email';
  const busy = saving || verification.pending !== null;
  const passwordValid = password.trim().length > 0 && password.length >= 8 && password.length <= 64;
  const canSubmit = step === 'email' ? EMAIL_PATTERN.test(email.trim())
    : step === 'code' ? verification.code.length === EMAIL_CODE_LENGTH
      : step === 'password' && passwordValid && password === passwordConfirm;

  function restart() {
    verification.reset();
    setError(undefined);
    setPassword('');
    setPasswordConfirm('');
  }

  async function submit() {
    if (!canSubmit || busy || request.current) return;
    setError(undefined);
    if (step === 'email' || step === 'code') {
      await verification.submit(step === 'email' ? 'send' : 'verify');
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setSaving(true);
    try {
      await resetPassword(email.trim(), password, passwordConfirm, controller.signal);
      if (!controller.signal.aborted) {
        setDone(true);
        setEmail('');
        restart();
      }
    } catch (cause) {
      if (controller.signal.aborted) return;
      if (cause instanceof ApiError && cause.code === 'AUTH_EMAIL_NOT_VERIFIED') {
        restart();
        setError('이메일 인증이 만료됐어요. 인증코드를 다시 요청해 주세요.');
        return;
      }
      setError(cause instanceof Error ? cause.message : '비밀번호를 재설정하지 못했어요.');
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setSaving(false);
    }
  }

  return {
    step,
    email,
    code: verification.code,
    password,
    passwordConfirm,
    busy,
    canSubmit,
    message: error ? { text: error, error: true } : verification.message,
    changeEmail: (value: string) => { setEmail(value); restart(); },
    changeCode: verification.changeCode,
    changePassword: (value: string) => { setPassword(value); setError(undefined); },
    changePasswordConfirm: (value: string) => { setPasswordConfirm(value); setError(undefined); },
    resend: () => verification.submit('send'),
    restart,
    submit,
  } as const;
}
