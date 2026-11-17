import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { exampleMedicationSchedules, exampleMedicineIds } from '../data/medicationExamples';
import { createMedicationSchedules, getTodayDoses, type MedicationScheduleInput, type MedicationSchedule } from '../utils/medicationSchedule';

type MedicationContextValue = {
  medicineIds: string[];
  toggleMedicine: (id: string) => void;
  schedules: MedicationSchedule[];
  saveMedicationSchedule: (medicineId: string, startDate: string, durationDays: number, doses: MedicationScheduleInput['doses']) => void;
  todayDoses: (ReturnType<typeof getTodayDoses>[number] & { completed: boolean })[];
  toggleDose: (doseId: string) => void;
};
const MedicationContext = createContext<MedicationContextValue | null>(null);

type MedicationProviderProps = {
  children: ReactNode;
  includeExamples?: boolean;
  familySchedules?: MedicationSchedule[];
};

export function MedicationProvider({ children, includeExamples = true, familySchedules }: MedicationProviderProps) {
  const [personalMedicineIds, setMedicineIds] = useState<string[]>(includeExamples ? exampleMedicineIds : []);
  const [personalSchedules, setSchedules] = useState<MedicationSchedule[]>(includeExamples ? exampleMedicationSchedules : []);
  const schedules = familySchedules ?? personalSchedules;
  const medicineIds = familySchedules ? [...new Set(familySchedules.map(schedule => schedule.medicineId))] : personalMedicineIds;
  const [completedDoseIds, setCompletedDoseIds] = useState<string[]>([]);
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = setTimeout(() => setToday(new Date()), midnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [today]);
  const todayDoses = getTodayDoses(medicineIds, schedules, today)
    .map(dose => ({ ...dose, completed: completedDoseIds.includes(dose.doseId) }));
  function toggleMedicine(id: string) {
    if (familySchedules) return;
    if (medicineIds.includes(id)) {
      setMedicineIds(current => current.filter(item => item !== id));
      setSchedules(current => current.filter(schedule => schedule.medicineId !== id));
    } else {
      setMedicineIds(current => [...current, id]);
    }
  }
  function saveMedicationSchedule(medicineId: string, startDate: string, durationDays: number, doses: MedicationScheduleInput['doses']) {
    if (familySchedules) return;
    const nextSchedules = createMedicationSchedules(medicineId, { startDate, durationDays, doses });
    setMedicineIds(current => current.includes(medicineId) ? current : [...current, medicineId]);
    setSchedules(current => [...current.filter(schedule => schedule.medicineId !== medicineId), ...nextSchedules]);
  }
  function toggleDose(doseId: string) {
    if (!todayDoses.some(dose => dose.doseId === doseId)) return;
    setCompletedDoseIds(current => current.includes(doseId) ? current.filter(id => id !== doseId) : [...current, doseId]);
  }
  return <MedicationContext.Provider value={{ medicineIds, toggleMedicine, schedules, saveMedicationSchedule, todayDoses, toggleDose }}>{children}</MedicationContext.Provider>;
}

export function useMedications() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error('복용 목록 제공자가 필요합니다.');
  return value;
}
