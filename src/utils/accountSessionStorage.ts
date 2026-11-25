import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { isAccountSession, isWardSession, type AuthSession } from '../api/auth';

const SESSION_KEY = 'onyak.account-session';

export async function readAccountSession() {
  const raw = Platform.OS === 'web'
    ? window.sessionStorage.getItem(SESSION_KEY)
    : await SecureStore.getItemAsync(SESSION_KEY);
  const value: unknown = raw ? JSON.parse(raw) : null;
  if (isWardSession(value)) return { session: value };
  if (!isAccountSession(value)) return null;
  const height = 'confirmedHeight' in value ? value.confirmedHeight : undefined;
  return {
    session: value,
    confirmedHeight: typeof height === 'number' && Number.isFinite(height) ? height : undefined,
  };
}

export async function writeAccountSession(session: AuthSession | null, confirmedHeight?: number | null) {
  const stored = session?.role === 'WARD' ? session : session && { ...session, confirmedHeight };
  if (Platform.OS === 'web') {
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(stored));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } else if (session) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(stored));
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}

const heightKey = (accountId: number) => `onyak.confirmed-height.${accountId}`;

export async function readConfirmedHeight(accountId: number) {
  const key = heightKey(accountId);
  const raw = Platform.OS === 'web' ? window.localStorage.getItem(key) : await SecureStore.getItemAsync(key);
  const height = Number(raw);
  return Number.isFinite(height) && height > 0 ? height : undefined;
}

export async function writeConfirmedHeight(accountId: number, height: number | null) {
  const key = heightKey(accountId);
  if (Platform.OS === 'web') {
    if (height === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, String(height));
  } else if (height === null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, String(height));
  }
}
