import { useEffect, useRef, useState } from 'react';
import Text from '../Typography/Text';
import type { GoogleLoginButtonProps } from './googleLoginTypes';

type GoogleIdentity = {
  initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
  renderButton: (element: HTMLElement, options: { theme: 'outline'; size: 'large'; text: 'signin_with'; locale: string; width: number }) => void;
};

let loading: Promise<GoogleIdentity> | undefined;
let activeCredentialHandler: ((response: { credential?: string }) => void) | undefined;
let configuredClient: string | undefined;

function loadGoogleIdentity() {
  const getIdentity = () => (window as Window & { google?: { accounts?: { id?: GoogleIdentity } } }).google?.accounts?.id;
  const ready = getIdentity();
  if (ready) return Promise.resolve(ready);
  if (loading) return loading;
  loading = new Promise<GoogleIdentity>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      const identity = getIdentity();
      if (identity) resolve(identity);
      else reject(new Error('구글 로그인 화면을 불러오지 못했어요.'));
    };
    script.onerror = () => reject(new Error('구글 로그인 화면을 불러오지 못했어요.'));
    document.head.appendChild(script);
  }).catch(error => {
    loading = undefined;
    throw error;
  });
  return loading;
}

export default function GoogleLoginButton({ disabled, onCredential, onError }: GoogleLoginButtonProps) {
  const target = useRef<HTMLDivElement>(null);
  const handlers = useRef({ disabled, onCredential, onError });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  useEffect(() => { handlers.current = { disabled, onCredential, onError }; }, [disabled, onCredential, onError]);

  useEffect(() => {
    const element = target.current;
    if (!clientId || !element) return;
    let mounted = true;
    const handleCredential = ({ credential }: { credential?: string }) => {
      if (handlers.current.disabled) return;
      if (credential) void handlers.current.onCredential(credential);
      else handlers.current.onError('구글에서 로그인 정보를 받지 못했어요.');
    };

    void loadGoogleIdentity().then(identity => {
      if (!mounted) return;
      activeCredentialHandler = handleCredential;
      if (configuredClient !== clientId) {
        identity.initialize({ client_id: clientId, callback: response => activeCredentialHandler?.(response) });
        configuredClient = clientId;
      }
      identity.renderButton(element, { theme: 'outline', size: 'large', text: 'signin_with', locale: 'ko', width: Math.max(200, Math.min(400, element.clientWidth)) });
      setStatus('ready');
    }).catch(() => {
      if (mounted) setStatus('error');
    });

    return () => {
      mounted = false;
      if (activeCredentialHandler === handleCredential) activeCredentialHandler = undefined;
      element.replaceChildren();
    };
  }, [clientId, attempt]);

  return (
    <div style={{ width: '100%', marginTop: 12, textAlign: 'center' }}>
      <div ref={target} inert={disabled} style={{ display: 'flex', justifyContent: 'center', opacity: disabled ? 0.5 : 1 }} />
      {!clientId ? <Text>구글 로그인 설정이 필요해요.</Text>
        : status === 'loading' ? <Text>구글 로그인 불러오는 중…</Text>
        : status === 'error' ? (
          <button type="button" onClick={() => { setStatus('loading'); setAttempt(value => value + 1); }}>구글 로그인 다시 불러오기</button>
        ) : null}
    </div>
  );
}
