import { requestApi } from './client';

export type AccountBody = {
  birth_date?: string | null;
  height?: number | null;
  weight?: number | null;
  gender?: 'M' | 'F' | null;
  is_pregnant?: boolean | null;
};

export type AccountProfile = AccountBody & {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
};

export function getAccountProfile(accessToken: string, signal: AbortSignal) {
  return requestApi<AccountProfile>('/users/me', { accessToken, signal, privateRequest: true });
}

export function patchAccountBody(body: AccountBody, accessToken: string, signal: AbortSignal) {
  return requestApi<AccountBody>('/users/me/body', { method: 'PATCH', body, accessToken, signal, privateRequest: true });
}

export type AccountChanges = { phone?: string; password?: string; current_password?: string };

export function patchAccountProfile(body: AccountChanges, accessToken: string, signal: AbortSignal) {
  return requestApi<Pick<AccountProfile, 'user_id' | 'name' | 'phone' | 'email'>>('/users/me', {
    method: 'PATCH', body, accessToken, signal, privateRequest: true,
  });
}

export function withdrawAccount(accessToken: string, signal: AbortSignal) {
  return requestApi<null>('/users/me', { method: 'DELETE', accessToken, signal, privateRequest: true });
}
