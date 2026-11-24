import { requestApi } from './client';

export type AccountProfile = {
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'M' | 'F';
  is_pregnant?: boolean;
};

export function getAccountProfile(accessToken: string, signal: AbortSignal) {
  return requestApi<AccountProfile>('/users/me', { accessToken, signal, privateRequest: true });
}
