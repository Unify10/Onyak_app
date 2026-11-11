import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [displayName, setDisplayName] = useState('김민지');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [, setPassword] = useState('');

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
