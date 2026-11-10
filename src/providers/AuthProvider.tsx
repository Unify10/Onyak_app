import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  displayName: string;
  email: string;
  signIn: (displayName?: string, email?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('김민지');
  const [email, setEmail] = useState('');

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    displayName,
    email,
    signIn: (name, accountEmail) => {
      if (name?.trim()) setDisplayName(name.trim());
      if (accountEmail?.trim()) setEmail(accountEmail.trim());
      setIsAuthenticated(true);
    },
    signOut: () => setIsAuthenticated(false),
  }), [displayName, email, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서 인증 정보를 사용해야 합니다.');
  return context;
}
