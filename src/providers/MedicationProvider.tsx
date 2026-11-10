import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { exampleMedicationSchedules, exampleMedicineIds } from '../data/medicationExamples';
import { getTodayDoses, type MedicationSchedule } from '../utils/medicationSchedule';

type MedicationContextValue = {
  medicineIds: string[];
  toggleMedicine: (id: string) => void;
  schedules: MedicationSchedule[];
  todayDoses: (ReturnType<typeof getTodayDoses>[number] & { completed: boolean })[];
  toggleDose: (doseId: string) => void;
};
const MedicationContext = createContext<MedicationContextValue | null>(null);

export function MedicationProvider({ children }: { children: ReactNode }) {
  const [medicineIds, setMedicineIds] = useState<string[]>(exampleMedicineIds);
  const [completedDoseIds, setCompletedDoseIds] = useState<string[]>([]);
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = setTimeout(() => setToday(new Date()), midnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [today]);
  const todayDoses = getTodayDoses(medicineIds, exampleMedicationSchedules, today)
    .map(dose => ({ ...dose, completed: completedDoseIds.includes(dose.doseId) }));
  function toggleMedicine(id: string) {
    setMedicineIds(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  }
  function toggleDose(doseId: string) {
    if (!todayDoses.some(dose => dose.doseId === doseId)) return;
    setCompletedDoseIds(current => current.includes(doseId) ? current.filter(id => id !== doseId) : [...current, doseId]);
  }
  return <MedicationContext.Provider value={{ medicineIds, toggleMedicine, schedules: exampleMedicationSchedules, todayDoses, toggleDose }}>{children}</MedicationContext.Provider>;
}

export function useMedications() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error('복용 목록 제공자가 필요합니다.');
  return value;
}
