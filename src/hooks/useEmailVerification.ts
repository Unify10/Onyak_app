import { useEffect, useRef, useState } from 'react';
import { sendEmailCode, sendPasswordResetCode, verifyEmailCode, verifyPasswordResetCode } from '../api/auth';
import { ApiError } from '../api/client';

export const EMAIL_CODE_LENGTH = 6;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useEmailVerification(email: string, purpose: 'signup' | 'password-reset' = 'signup') {
  const isPasswordReset = purpose === 'password-reset';
  const [code, setCode] = useState('');
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [pending, setPending] = useState<'send' | 'verify' | null>(null);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const request = useRef<AbortController | null>(null);

  useEffect(() => () => request.current?.abort(), []);

  function reset() {
    request.current?.abort();
    request.current = null;
    setCode('');
    setSentEmail(null);
    setVerified(false);
    setPending(null);
    setMessage(null);
  }

  function changeCode(value: string) {
    const normalized = value.normalize('NFKC').toUpperCase().replace(/[^A-Z0-9]/g, '');
    setVerified(false);
    if (normalized.length > EMAIL_CODE_LENGTH) {
      setCode('');
      setMessage({ text: '메일에서 인증코드 6자리만 복사해 주세요.', error: true });
      return;
    }
    setCode(normalized);
    setMessage(null);
  }

  async function submit(operation: 'send' | 'verify') {
    if (request.current) return;
    const target = email.trim();
    if (!EMAIL_PATTERN.test(target)) {
      setMessage({ text: '올바른 이메일 주소를 입력해 주세요.', error: true });
      return;
    }
    if (operation === 'verify' && (sentEmail !== target || code.length !== EMAIL_CODE_LENGTH)) {
      setMessage({ text: '이메일에 받은 인증코드 6자리를 입력해 주세요.', error: true });
      return;
    }

    const controller = new AbortController();
    request.current = controller;
    setPending(operation);
    setMessage(null);
    try {
      if (operation === 'send') {
        const send = isPasswordReset ? sendPasswordResetCode : sendEmailCode;
        await send(target, controller.signal);
      } else {
        const verify = isPasswordReset ? verifyPasswordResetCode : verifyEmailCode;
        await verify(target, code, controller.signal);
      }
      if (controller.signal.aborted) return;
      if (operation === 'send') {
        setSentEmail(target);
        setVerified(false);
        setCode('');
        setMessage({ text: isPasswordReset
          ? '재설정 가능한 계정이면 입력한 이메일로 인증코드가 전송돼요.'
          : '이메일로 인증코드를 보냈어요.' });
      } else {
        setVerified(true);
        setMessage({ text: '이메일 인증이 완료됐어요.' });
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        const mismatch = operation === 'verify' && error instanceof ApiError && error.code === 'AUTH_EMAIL_CODE_MISMATCH';
        const text = mismatch
          ? '코드가 일치하지 않거나 만료됐어요. 마지막 발송 요청으로 받은 코드를 확인하거나 재발송해 주세요.'
          : error instanceof Error ? error.message : '이메일 인증 요청에 실패했어요.';
        setMessage({ text, error: true });
      }
    } finally {
      if (request.current === controller) {
        request.current = null;
        setPending(null);
      }
    }
  }

  return { code, sent: sentEmail !== null, verified, pending, message, changeCode, reset, submit };
}
