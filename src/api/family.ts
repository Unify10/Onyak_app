import { requestApi } from './client';

export type FamilySummary = { ward_id: number; name: string };

export type FamilyProfile = FamilySummary & {
  birth_date?: string;
  weight?: number;
  height?: number;
  gender?: 'M' | 'F';
  is_pregnant?: boolean;
};

export function getFamilyList(accessToken: string, signal: AbortSignal) {
  return requestApi<FamilySummary[]>('/wards', { accessToken, signal, privateRequest: true });
}

export function getFamilyProfile(id: string, accessToken: string, signal: AbortSignal) {
  return requestApi<FamilyProfile>(`/wards/${encodeURIComponent(id)}`, { accessToken, signal, privateRequest: true });
}
