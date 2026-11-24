import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { isAccountSession, type AccountSession } from '../api/auth';

const SESSION_KEY = 'onyak.account-session';

export async function readAccountSession() {
  const raw = Platform.OS === 'web'
    ? window.sessionStorage.getItem(SESSION_KEY)
    : await SecureStore.getItemAsync(SESSION_KEY);
  const value: unknown = raw ? JSON.parse(raw) : null;
  return isAccountSession(value) ? value : null;
}

export async function writeAccountSession(session: AccountSession | null) {
  if (Platform.OS === 'web') {
    if (session) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } else if (session) {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  } else {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}
