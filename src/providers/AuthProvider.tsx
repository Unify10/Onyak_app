import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { logout, refreshSession, type AccountSession } from '../api/auth';
import { ApiError } from '../api/client';
import { getAccountProfile, type AccountProfile } from '../api/profile';
import { readAccountSession, writeAccountSession } from '../utils/accountSessionStorage';

type AuthContextValue = {
  isAuthenticated: boolean;
  dependentId: string | null;
  signInDependent: (id: string) => void;
  displayName: string;
  email: string;
  contactNumber: string;
  signIn: (session: AccountSession, keepLogin: boolean) => void;
  signOut: () => void;
  loadProfile: (signal: AbortSignal) => Promise<AccountProfile>;
  withSession: <T>(request: (accessToken: string) => Promise<T>, signal: AbortSignal) => Promise<T>;
  updateDisplayName: (name: string) => void;
  updateContactNumber: (number: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, loadingFallback = null }: { children: ReactNode; loadingFallback?: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dependentId, setDependentId] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [, setPassword] = useState('');
  const currentSession = useRef<AccountSession | null>(null);
  const keepSession = useRef(false);
  const pendingWrite = useRef<Promise<void>>(Promise.resolve());
  const pendingRefresh = useRef<{ session: AccountSession; request: Promise<AccountSession> } | null>(null);

  const persist = useCallback((session: AccountSession | null) => {
    pendingWrite.current = pendingWrite.current.then(() => writeAccountSession(session)).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    void readAccountSession().then(session => {
      if (!active || !session) return;
      currentSession.current = session;
      keepSession.current = true;
      setDisplayName(session.name);
      setEmail(session.email);
      setIsAuthenticated(true);
    }).catch(() => {}).finally(() => {
      if (active) setReady(true);
    });

    return () => { active = false; };
  }, []);

  const clearSession = useCallback(() => {
    const session = currentSession.current;
    currentSession.current = null;
    keepSession.current = false;
    persist(null);
    setIsAuthenticated(false);
    setDisplayName('');
    setEmail('');
    setContactNumber('');
    setPassword('');
    return session;
  }, [persist]);

  const signOut = useCallback(() => {
    const session = clearSession();
    setDependentId(null);
    if (session) void logout(session.access_token).catch(() => {});
  }, [clearSession]);

  function signIn(session: AccountSession, keepLogin: boolean) {
    currentSession.current = session;
    keepSession.current = keepLogin;
    persist(keepLogin ? session : null);
    setDependentId(null);
    setDisplayName(session.name);
    setEmail(session.email);
    setContactNumber('');
    setIsAuthenticated(true);
  }

  const renewSession = useCallback((session: AccountSession) => {
    const stored = currentSession.current;
    if (!stored || stored.user_id !== session.user_id) throw new Error('다시 로그인해 주세요.');
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
    if (!session) throw new Error('다시 로그인해 주세요.');

    let result: T;
    try {
      result = await request(session.access_token);
    } catch (error) {
      if (signal.aborted || !(error instanceof ApiError) || error.status !== 401) throw error;
      const next = await renewSession(session);
      if (signal.aborted) throw new Error('요청이 취소됐어요.');
      result = await request(next.access_token);
    }

    if (signal.aborted || currentSession.current?.user_id !== session.user_id) {
      throw new Error('요청이 취소됐어요.');
    }
    return result;
  }, [renewSession]);

  const loadProfile = useCallback(async (signal: AbortSignal) => {
    const profile = await withSession(token => getAccountProfile(token, signal), signal);
    if (currentSession.current?.user_id !== profile?.user_id) {
      throw new Error('계정 정보를 불러오지 못했어요.');
    }
    setDisplayName(profile.name);
    setEmail(profile.email);
    setContactNumber(profile.phone ?? '');
    return profile;
  }, [withSession]);

  if (!ready) return <>{loadingFallback}</>;

  const value: AuthContextValue = {
    isAuthenticated,
    dependentId,
    signInDependent: id => {
      clearSession();
      setDependentId(id);
    },
    displayName,
    email,
    contactNumber,
    signIn,
    signOut,
    loadProfile,
    withSession,
    updateDisplayName: setDisplayName,
    updateContactNumber: setContactNumber,
    updateEmail: setEmail,
    updatePassword: setPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서 인증 정보를 사용해야 합니다.');
  return context;
}
