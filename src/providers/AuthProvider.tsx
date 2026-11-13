import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const AUTH_STORAGE_KEY = 'onyak.auth-state';

type PersistedAuthState = { isAuthenticated: boolean; displayName: string; email: string; contactNumber: string };

function readPersistedAuthState(): Partial<PersistedAuthState> {
  if (typeof window === 'undefined') return {};
  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) as Partial<PersistedAuthState> : {};
  } catch {
    return {};
  }
}

type AuthContextValue = {
  isAuthenticated: boolean;
  displayName: string;
  email: string;
  contactNumber: string;
  signIn: (displayName?: string, email?: string) => void;
  signOut: () => void;
  updateDisplayName: (name: string) => void;
  updateContactNumber: (number: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialAuth] = useState(readPersistedAuthState);
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated ?? false);
  const [displayName, setDisplayName] = useState(initialAuth.displayName ?? '김민지');
  const [email, setEmail] = useState(initialAuth.email ?? '');
  const [contactNumber, setContactNumber] = useState(initialAuth.contactNumber ?? '');
  const [, setPassword] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const state: PersistedAuthState = { isAuthenticated, displayName, email, contactNumber };
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }, [contactNumber, displayName, email, isAuthenticated]);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    displayName,
    email,
    contactNumber,
    signIn: (name, accountEmail) => {
      if (name?.trim()) setDisplayName(name.trim());
      if (accountEmail?.trim()) setEmail(accountEmail.trim());
      setIsAuthenticated(true);
    },
    signOut: () => setIsAuthenticated(false),
    updateDisplayName: setDisplayName,
    updateContactNumber: setContactNumber,
    updateEmail: setEmail,
    updatePassword: setPassword,
  }), [contactNumber, displayName, email, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서 인증 정보를 사용해야 합니다.');
  return context;
}
