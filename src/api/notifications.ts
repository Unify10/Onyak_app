import { requestApi } from './client';

export type ServerNotification = {
  id: number;
  type: 'MED_REMINDER' | 'SOS' | 'WARNING';
  message: string;
  is_read: boolean;
  created_at: string;
};

export const NOTIFICATION_PAGE_SIZE = 20;

export function getNotifications(accessToken: string, signal: AbortSignal, page = 0) {
  return requestApi<ServerNotification[]>(`/notifications?page=${page}&size=${NOTIFICATION_PAGE_SIZE}`, {
    accessToken,
    signal,
    privateRequest: true,
  });
}

export function sendSosRequest(accessToken: string, signal: AbortSignal) {
  return requestApi<null>('/sos', { body: {}, accessToken, signal, privateRequest: true });
}
