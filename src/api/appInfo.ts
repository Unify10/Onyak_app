import { requestApi } from './client';

export type AppInfo = {
  version: string;
  notice_url: string | null;
  terms_url: string | null;
  privacy_url: string | null;
};

export async function getAppInfo(signal: AbortSignal): Promise<AppInfo> {
  const info = await requestApi<AppInfo>('/app/info', { signal });
  if (typeof info?.version !== 'string') throw new Error('서버에서 앱 정보를 받지 못했어요.');

  return info;
}
