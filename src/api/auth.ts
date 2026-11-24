import { requestApi } from './client';

export type Tokens = { access_token: string; refresh_token: string };
export type AccountSession = Tokens & { user_id: number; email: string; name: string };

type SignupInput = {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  phone: string;
  birth_date?: string;
  height?: number;
  weight?: number;
  gender?: 'M' | 'F';
  is_pregnant?: boolean;
};

function postAuth<T>(path: string, body: object, signal?: AbortSignal) {
  return requestApi<T>(`/auth/${path}`, { body, signal, privateRequest: true });
}

export function sendEmailCode(email: string, signal: AbortSignal) {
  return postAuth<null>('email/send', { email }, signal);
}

export function verifyEmailCode(email: string, code: string, signal: AbortSignal) {
  return postAuth<null>('email/verify', { email, code }, signal);
}

export function signup(input: SignupInput, signal: AbortSignal) {
  return postAuth<AccountSession>('signup', input, signal);
}

export async function login(email: string, password: string, signal: AbortSignal) {
  const session = await postAuth<AccountSession>('login', { email, password }, signal);
  if (!isAccountSession(session)) throw new Error('서버에서 로그인 정보를 받지 못했어요.');
  return session;
}

export async function refreshSession(refreshToken: string) {
  const tokens = await postAuth<Tokens>('refresh', { refresh_token: refreshToken });
  if (!tokens?.access_token || !tokens.refresh_token) throw new Error('서버에서 새 로그인 정보를 받지 못했어요.');
  return tokens;
}

export function logout(accessToken: string) {
  return requestApi<null>('/auth/logout', { body: {}, accessToken, privateRequest: true });
}

export function isAccountSession(value: unknown): value is AccountSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<AccountSession>;
  return Number.isInteger(session.user_id)
    && typeof session.name === 'string'
    && typeof session.email === 'string'
    && typeof session.access_token === 'string' && Boolean(session.access_token)
    && typeof session.refresh_token === 'string' && Boolean(session.refresh_token);
}
