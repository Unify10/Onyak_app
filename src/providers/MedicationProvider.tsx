import { useContext, useEffect, useState, type ReactNode } from 'react';
import { medicines as exampleMedicines } from '../components/Search/medicineData';
import type { Medicine } from '../components/Search/types';
import { MedicationContext } from './MedicationContext';
import { exampleMedicationSchedules, exampleMedicineIds } from '../data/medicationExamples';
import { createMedicationSchedules, getTodayDoses, type MedicationScheduleInput, type MedicationSchedule } from '../utils/medicationSchedule';

type MedicationProviderProps = {
  children: ReactNode;
  includeExamples?: boolean;
  familySchedules?: MedicationSchedule[];
};

export function MedicationProvider({ children, includeExamples = true, familySchedules }: MedicationProviderProps) {
  const parent = useContext(MedicationContext);
  const [remoteMedicines, setRemoteMedicines] = useState<Medicine[]>([]);
  const medicines = parent?.medicines ?? [...exampleMedicines, ...remoteMedicines];
  function rememberMedicine(medicine: Medicine) {
    if (parent) {
      parent.rememberMedicine(medicine);
    } else if (medicine.id.startsWith('drug-')) {
      setRemoteMedicines(current => [...current.filter(item => item.id !== medicine.id), medicine]);
    }
  }
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
  return <MedicationContext.Provider value={{ medicineIds, medicines, rememberMedicine, toggleMedicine, schedules, saveMedicationSchedule, todayDoses, toggleDose }}>{children}</MedicationContext.Provider>;
}
