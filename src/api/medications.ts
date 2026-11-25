import { ApiError, requestApi } from './client';
import type { FamilyMedication } from './family';

export type MedicationOptions = { schedule_times: string[]; push_enabled: boolean };
export type MedicationCalendarDay = { date: string; scheduled: number; completed: number; rate: number | null };
type MedicationCalendar = { ward_id: number; month: string; days: MedicationCalendarDay[] };

export function getFamilyMedication(id: number, accessToken: string, signal: AbortSignal) {
  return requestApi<FamilyMedication>(`/medications/${id}`, { accessToken, signal, privateRequest: true });
}

export function updateFamilyMedication(id: number, input: { active?: boolean; dosage?: string }, accessToken: string, signal: AbortSignal) {
  return requestApi<FamilyMedication>(`/medications/${id}`, { method: 'PATCH', body: input, accessToken, signal, privateRequest: true });
}

export function getFamilyMedicationSchedule(id: number, accessToken: string, signal: AbortSignal) {
  return requestApi<MedicationOptions>(`/medications/${id}/schedule`, { accessToken, signal, privateRequest: true });
}

export function deleteFamilyMedication(id: number, accessToken: string, signal: AbortSignal) {
  return requestApi<void>(`/medications/${id}`, { method: 'DELETE', accessToken, signal, privateRequest: true });
}

export function updateFamilyMedicationSchedule(id: number, input: MedicationOptions, accessToken: string, signal: AbortSignal) {
  return requestApi<MedicationOptions>(`/medications/${id}/schedule`, { method: 'PATCH', body: input, accessToken, signal, privateRequest: true });
}

export async function checkFamilyMedication(id: number, time: string, accessToken: string, signal: AbortSignal) {
  try {
    await requestApi<unknown>(`/medications/${id}/check`, { body: { schedule_time: time }, accessToken, signal, privateRequest: true });
  } catch (error) {
    if (!(error instanceof ApiError) || (error.status !== 409 || error.code !== 'CHECK_ALREADY_DONE')) throw error;
  }
}

export async function getMedicationCalendar(wardId: string, month: string, accessToken: string, signal: AbortSignal) {
  const calendar = await requestApi<MedicationCalendar>(`/wards/${encodeURIComponent(wardId)}/calendar?month=${encodeURIComponent(month)}`, { accessToken, signal, privateRequest: true });
  if (String(calendar?.ward_id) !== wardId || calendar.month !== month || !Array.isArray(calendar.days)) {
    throw new Error('복약 달력 데이터를 읽지 못했어요.');
  }
  return calendar.days;
}
