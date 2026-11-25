import { createContext, useContext } from 'react';
import type { FamilyMedication } from '../api/family';
import type { MedicationCalendarDay } from '../api/medications';
import type { Medicine } from '../components/Search/types';
import type { getTodayDoses, MedicationSchedule, MedicationScheduleInput } from '../utils/medicationSchedule';

type MedicationContextValue = {
  medicineIds: string[];
  medicines: Medicine[];
  rememberMedicine: (medicine: Medicine) => void;
  toggleMedicine: (id: string) => void;
  clearPersonalMedications?: () => void;
  schedules: MedicationSchedule[];
  saveMedicationSchedule: (medicineId: string, startDate: string, durationDays: number, doses: MedicationScheduleInput['doses'], medicine?: Medicine) => void;
  todayDoses: (ReturnType<typeof getTodayDoses>[number] & { completed: boolean })[];
  toggleDose: (doseId: string) => void;
  ward?: {
    id: string;
    records: FamilyMedication[];
    loading: boolean;
    loadError?: string;
    retry: () => void;
    checkBusy: boolean;
    checkError?: string;
    todayRecord?: MedicationCalendarDay;
    todayRecordLoading: boolean;
    todayRecordError?: string;
    retryTodayRecord: () => void;
  };
};
export const MedicationContext = createContext<MedicationContextValue | null>(null);

export function useMedications() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error('복용 목록 제공자가 필요합니다.');
  return value;
}
