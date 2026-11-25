import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { getWardGuardianName, logout, refreshSession, type AuthSession } from '../api/auth';
import { ApiError } from '../api/client';
import type { WardInvitation } from '../api/wardAuth';
import { getAccountProfile, patchAccountBody, type AccountBody } from '../api/profile';
import { readAccountSession, readConfirmedHeight, writeAccountSession, writeConfirmedHeight } from '../utils/accountSessionStorage';
import { AuthContext, type AuthContextValue } from './AuthContext';

export { useAuth } from './AuthContext';

export function AuthProvider({ children, loadingFallback = null }: { children: ReactNode; loadingFallback?: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [dependentId, setDependentId] = useState<string | null>(null);
  const [guardianName, setGuardianName] = useState<string>();
  const [wardInvitations, setWardInvitations] = useState(() => new Map<number, WardInvitation>());
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [, setPassword] = useState('');
  const currentSession = useRef<AuthSession | null>(null);
  const keepSession = useRef(false);
  const confirmedBody = useRef<AccountBody | null>(null);
  const sessionGeneration = useRef(0);
  const pendingWrite = useRef<Promise<void>>(Promise.resolve());
  const pendingRefresh = useRef<{ session: AuthSession; request: Promise<AuthSession> } | null>(null);

  const persist = useCallback((session: AuthSession | null) => {
    const height = confirmedBody.current?.height;
    pendingWrite.current = pendingWrite.current.then(() => writeAccountSession(session, height)).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    void readAccountSession().then(stored => {
      if (!active || !stored) return;
      const { session, confirmedHeight } = stored;
      confirmedBody.current = confirmedHeight === undefined ? null : { height: confirmedHeight };
      currentSession.current = session;
      keepSession.current = true;
      setDisplayName(session.name);
      setEmail(session.email ?? '');
      setAccountId(session.role === 'WARD' ? null : session.user_id);
      setDependentId(session.role === 'WARD' ? String(session.user_id) : null);
      setGuardianName(session.role === 'WARD' ? getWardGuardianName(session) : undefined);
    }).catch(() => {}).finally(() => {
      if (active) setReady(true);
    });

    return () => { active = false; };
  }, []);

  const clearSession = useCallback(() => {
    const session = currentSession.current;
    currentSession.current = null;
    confirmedBody.current = null;
    sessionGeneration.current += 1;
    keepSession.current = false;
    persist(null);
    setWardInvitations(new Map());
    setAccountId(null);
    setDependentId(null);
    setGuardianName(undefined);
    setDisplayName('');
    setEmail('');
    setContactNumber('');
    setPassword('');
    return session;
  }, [persist]);

  const signOut = useCallback(() => {
    const session = clearSession();
    if (session) void logout(session.access_token).catch(() => {});
  }, [clearSession]);

  function signIn(session: AuthSession, keepLogin: boolean) {
    setWardInvitations(new Map());
    confirmedBody.current = null;
    sessionGeneration.current += 1;
    currentSession.current = session;
    keepSession.current = keepLogin;
    persist(keepLogin ? session : null);
    setDependentId(session.role === 'WARD' ? String(session.user_id) : null);
    setGuardianName(session.role === 'WARD' ? getWardGuardianName(session) : undefined);
    setDisplayName(session.name);
    setEmail(session.email ?? '');
    setContactNumber('');
    setAccountId(session.role === 'WARD' ? null : session.user_id);
  }

  const renewSession = useCallback((session: AuthSession) => {
    const stored = currentSession.current;
    if (!stored || stored.user_id !== session.user_id || stored.role !== session.role) throw new Error('다시 로그인해 주세요.');
    if (stored !== session) return Promise.resolve(stored);
    if (pendingRefresh.current?.session === session) return pendingRefresh.current.request;

    const request = refreshSession(session.refresh_token).then(tokens => {
      if (currentSession.current !== session) throw new Error('다시 로그인해 주세요.');
      const next = { ...session, ...tokens };
      currentSession.current = next;
      if (keepSession.current) persist(next);
      return next;
    }).catch(error => {
      if (currentSession.current === session && error instanceof ApiError && [400, 401, 403].includes(error.status)) {
        signOut();
      }
      throw error;
    }).finally(() => {
      if (pendingRefresh.current?.request === request) pendingRefresh.current = null;
    });

    pendingRefresh.current = { session, request };
    return request;
  }, [persist, signOut]);

  const withSession = useCallback(async <T,>(
    request: (accessToken: string) => Promise<T>,
    signal: AbortSignal,
  ) => {
    const session = currentSession.current;
    const generation = sessionGeneration.current;
    if (!session) throw new Error('다시 로그인해 주세요.');

    let result: T;
    try {
      result = await request(session.access_token);
    } catch (error) {
      if (signal.aborted || generation !== sessionGeneration.current || !(error instanceof ApiError) || error.status !== 401) throw error;
      const next = await renewSession(session);
      if (signal.aborted) throw new Error('요청이 취소됐어요.');
      result = await request(next.access_token);
    }

    if (signal.aborted || generation !== sessionGeneration.current) {
      throw new Error('요청이 취소됐어요.');
    }
    return result;
  }, [renewSession]);

  const loadProfile = useCallback(async (signal: AbortSignal) => {
    const generation = sessionGeneration.current;
    const profile = await withSession(token => getAccountProfile(token, signal), signal);
    if (currentSession.current?.user_id !== profile?.user_id) {
      throw new Error('계정 정보를 불러오지 못했어요.');
    }

    const storedHeight = profile.height === undefined && confirmedBody.current?.height === undefined
      ? await readConfirmedHeight(profile.user_id).catch(() => undefined)
      : undefined;
    if (signal.aborted || generation !== sessionGeneration.current) {
      throw new Error('요청이 취소됐어요.');
    }

    const confirmedHeight = confirmedBody.current?.height;
    const height = profile.height !== undefined ? profile.height : confirmedHeight !== undefined ? confirmedHeight : storedHeight;
    if (height !== undefined && storedHeight === undefined) {
      void writeConfirmedHeight(profile.user_id, height).catch(() => {});
    }
    setDisplayName(profile.name);
    setEmail(profile.email);
    setContactNumber(profile.phone ?? '');
    return {
      ...profile,
      // 조회 응답에 빠진 값은 서버가 전에 확인한 값으로 채웁니다.
      birth_date: profile.birth_date === undefined ? confirmedBody.current?.birth_date : profile.birth_date,
      height,
    };
  }, [withSession]);

  const updateBody = useCallback(async (body: AccountBody, signal: AbortSignal) => {
    const saved = await withSession(token => patchAccountBody(body, token, signal), signal);
    if (!saved || typeof saved !== 'object') throw new Error('서버에서 저장된 신체정보를 받지 못했어요.');
    confirmedBody.current = saved;
    const session = currentSession.current;
    if (session && session.role !== 'WARD') {
      if (keepSession.current) persist(session);
      if (saved.height !== undefined) {
        await writeConfirmedHeight(session.user_id, saved.height).catch(() => {});
      }
    }
    return saved;
  }, [persist, withSession]);

  if (!ready) return <>{loadingFallback}</>;

  function rememberWardInvitation(wardId: number, invitation: WardInvitation) {
    const session = currentSession.current;
    if (!session || session.role === 'WARD') return;
    const now = Date.now();
    if (invitation.expiresAt <= now) return;
    setWardInvitations(current => {
      const active = new Map([...current].filter(([, issued]) => issued.expiresAt > now));
      active.set(wardId, invitation);
      return active;
    });
  }

  const value: AuthContextValue = {
    isAuthenticated: accountId !== null,
    accountId,
    dependentId,
    guardianName,
    wardInvitations,
    rememberWardInvitation,
    signInDependent: session => signIn(session, true),
    displayName,
    email,
    contactNumber,
    signIn,
    signOut,
    loadProfile,
    updateBody,
    withSession,
    updateDisplayName: setDisplayName,
    updateContactNumber: setContactNumber,
    updateEmail: setEmail,
    updatePassword: setPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
