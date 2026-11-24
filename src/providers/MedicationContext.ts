import { createContext, useContext } from 'react';
import type { Medicine } from '../components/Search/types';
import type { getTodayDoses, MedicationSchedule, MedicationScheduleInput } from '../utils/medicationSchedule';

type MedicationContextValue = {
  medicineIds: string[];
  medicines: Medicine[];
  rememberMedicine: (medicine: Medicine) => void;
  toggleMedicine: (id: string) => void;
  schedules: MedicationSchedule[];
  saveMedicationSchedule: (medicineId: string, startDate: string, durationDays: number, doses: MedicationScheduleInput['doses']) => void;
  todayDoses: (ReturnType<typeof getTodayDoses>[number] & { completed: boolean })[];
  toggleDose: (doseId: string) => void;
};
export const MedicationContext = createContext<MedicationContextValue | null>(null);

export function useMedications() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error('복용 목록 제공자가 필요합니다.');
  return value;
}
