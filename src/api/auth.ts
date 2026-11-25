import { requestApi } from './client';

export type Tokens = { access_token: string; refresh_token: string };
type SessionIdentity = Tokens & { user_id: number; name: string };
export type AccountSession = SessionIdentity & { email: string; role?: 'GUARDIAN' };
export type WardSession = SessionIdentity & { email?: null; role: 'WARD'; guardian_name?: unknown };
export type AuthSession = AccountSession | WardSession;

function isSessionIdentity(value: unknown): value is SessionIdentity {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<SessionIdentity>;
  return Number.isInteger(session.user_id)
    && typeof session.name === 'string'
    && typeof session.access_token === 'string' && Boolean(session.access_token)
    && typeof session.refresh_token === 'string' && Boolean(session.refresh_token);
}

export function isWardSession(value: unknown): value is WardSession {
  if (!isSessionIdentity(value)) return false;
  const session = value as Partial<WardSession>;
  return session.role === 'WARD' && session.email == null;
}

export function getWardGuardianName(session: WardSession) {
  const name = session.guardian_name;
  return typeof name === 'string' ? name.trim() || undefined : undefined;
}

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

export function sendPasswordResetCode(email: string, signal: AbortSignal) {
  return postAuth<null>('password/reset/send', { email }, signal);
}

export function verifyPasswordResetCode(email: string, code: string, signal: AbortSignal) {
  return postAuth<null>('password/reset/verify', { email, code }, signal);
}

export function resetPassword(email: string, password: string, passwordConfirm: string, signal: AbortSignal) {
  return postAuth<null>('password/reset', { email, password, password_confirm: passwordConfirm }, signal);
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
  if (!isSessionIdentity(value)) return false;
  const session = value as Partial<AccountSession>;
  return typeof session.email === 'string' && (session.role === undefined || session.role === 'GUARDIAN');
}
