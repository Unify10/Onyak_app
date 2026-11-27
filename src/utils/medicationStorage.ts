import type { Medicine } from '../components/Search/types';
import type { MedicationSchedule } from './medicationSchedule';

export type PersonalCabinet = { medicineIds: string[]; medicines: Medicine[]; schedules: MedicationSchedule[]; completedDoseIds: string[] };
export const emptyCabinet: PersonalCabinet = { medicineIds: [], medicines: [], schedules: [], completedDoseIds: [] };

export function readCabinet(value: unknown): PersonalCabinet {
  if (!value || typeof value !== 'object') return emptyCabinet;
  const cabinet = value as Partial<PersonalCabinet>;
  if (!Array.isArray(cabinet.medicineIds) || !Array.isArray(cabinet.medicines)
    || !Array.isArray(cabinet.schedules) || !Array.isArray(cabinet.completedDoseIds)) return emptyCabinet;
  return {
    medicineIds: cabinet.medicineIds.filter(id => typeof id === 'string'),
    medicines: cabinet.medicines.filter(item => typeof item?.id === 'string' && typeof item?.name === 'string'),
    schedules: cabinet.schedules.filter(item => typeof item?.id === 'string' && typeof item?.medicineId === 'string'
      && typeof item.time === 'string' && Array.isArray(item.daysOfWeek)),
    completedDoseIds: cabinet.completedDoseIds.filter(id => typeof id === 'string'),
  };
}

export const emptyCheckedDoses: string[] = [];

export function readCheckedDoses(value: unknown) {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : emptyCheckedDoses;
}
