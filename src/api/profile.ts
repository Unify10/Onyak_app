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

export type NotificationPreferences = {
  medication_push_enabled: boolean;
  sos_push_enabled: boolean;
  marketing_push_enabled: boolean;
};

export async function patchNotificationPreferences(body: Partial<NotificationPreferences>, accessToken: string, signal: AbortSignal) {
  const settings = await requestApi<NotificationPreferences>('/users/me/settings', {
    method: 'PATCH', body, accessToken, signal, privateRequest: true,
  });
  if (typeof settings?.medication_push_enabled !== 'boolean'
    || typeof settings.sos_push_enabled !== 'boolean' || typeof settings.marketing_push_enabled !== 'boolean') {
    throw new Error('서버의 알림 설정을 확인하지 못했어요.');
  }
  return settings;
}

export function getNotificationPreferences(accessToken: string, signal: AbortSignal) {
  // 서버는 빈 변경 요청에 저장된 설정을 반환합니다.
  return patchNotificationPreferences({}, accessToken, signal);
}
