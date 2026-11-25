import { createContext, useContext } from 'react';
import type { AccountSession, WardSession } from '../api/auth';
import type { AccountBody, AccountProfile } from '../api/profile';
import type { WardInvitation } from '../api/wardAuth';

export type AuthContextValue = {
  isAuthenticated: boolean;
  accountId: number | null;
  dependentId: string | null;
  guardianName?: string;
  wardInvitations: ReadonlyMap<number, WardInvitation>;
  rememberWardInvitation: (wardId: number, invitation: WardInvitation) => void;
  signInDependent: (session: WardSession) => void;
  displayName: string;
  email: string;
  contactNumber: string;
  signIn: (session: AccountSession, keepLogin: boolean) => void;
  signOut: () => void;
  loadProfile: (signal: AbortSignal) => Promise<AccountProfile>;
  updateBody: (body: AccountBody, signal: AbortSignal) => Promise<AccountBody>;
  withSession: <T>(request: (accessToken: string) => Promise<T>, signal: AbortSignal) => Promise<T>;
  updateDisplayName: (name: string) => void;
  updateContactNumber: (number: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider 안에서 인증 정보를 사용해야 합니다.');
  return context;
}
