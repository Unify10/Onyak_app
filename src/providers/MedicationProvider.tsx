import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { exampleMedicationSchedules, exampleMedicineIds } from '../data/medicationExamples';
import { addDaysToDateKey, getTodayDoses, type DoseTimeOfDay, type MedicationSchedule } from '../utils/medicationSchedule';

type DoseTimeInput = { timeOfDay: DoseTimeOfDay; time: string };

type MedicationContextValue = {
  medicineIds: string[];
  toggleMedicine: (id: string) => void;
  schedules: MedicationSchedule[];
  saveMedicationSchedule: (medicineId: string, startDate: string, durationDays: number, doses: DoseTimeInput[]) => void;
  todayDoses: (ReturnType<typeof getTodayDoses>[number] & { completed: boolean })[];
  toggleDose: (doseId: string) => void;
};
const MedicationContext = createContext<MedicationContextValue | null>(null);

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medicineIds, setMedicineIds] = useState<string[]>(exampleMedicineIds);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>(exampleMedicationSchedules);
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
    if (medicineIds.includes(id)) {
      setMedicineIds(current => current.filter(item => item !== id));
      setSchedules(current => current.filter(schedule => schedule.medicineId !== id));
    } else {
      setMedicineIds(current => [...current, id]);
    }
  }
  function saveMedicationSchedule(medicineId: string, startDate: string, durationDays: number, doses: DoseTimeInput[]) {
    const endDate = addDaysToDateKey(startDate, durationDays - 1);
    const createdAt = Date.now();
    const nextSchedules = doses.map((dose, index) => ({
      id: `${medicineId}-${createdAt}-${index}`,
      medicineId,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      timeOfDay: dose.timeOfDay,
      time: dose.time,
      startDate,
      endDate,
    }));
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
