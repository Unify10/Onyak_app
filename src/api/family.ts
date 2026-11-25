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

export async function getFamilyProfile(id: string, accessToken: string, signal: AbortSignal) {
  const profile = await requestApi<FamilyProfile>(`/wards/${encodeURIComponent(id)}`, { accessToken, signal, privateRequest: true });
  if (!profile || String(profile.ward_id) !== id || typeof profile.name !== 'string') {
    throw new Error('가족 정보를 읽지 못했어요.');
  }
  return profile;
}

export type FamilyMedication = {
  medication_id: number;
  drug_name: string;
  drug_id: string;
  ingredients?: string[];
  dosage: string;
  push_enabled: boolean;
  start_date: string;
  end_date: string | null;
  active: boolean;
  schedule_times: string[];
};

export async function getFamilyMedications(id: string, accessToken: string, signal: AbortSignal) {
  const items = await requestApi<FamilyMedication[]>(
    `/wards/${encodeURIComponent(id)}/medications?status=all`,
    { accessToken, signal, privateRequest: true },
  );
  if (!Array.isArray(items) || items.some(item => !item || !Array.isArray(item.schedule_times))) {
    throw new Error('가족 복용 목록을 읽지 못했어요.');
  }
  return items;
}

export type FamilyMedicationInput = {
  item_seq: string;
  dosage: string;
  start_date: string;
  schedule_times: string[];
};

export function addFamilyMedication(wardId: number, input: FamilyMedicationInput, accessToken: string, signal: AbortSignal) {
  return requestApi<FamilyMedication>(`/wards/${wardId}/medications`, {
    body: input, accessToken, signal, privateRequest: true,
  });
}
