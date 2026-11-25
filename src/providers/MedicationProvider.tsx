import { useContext, useEffect, useState, type ReactNode } from 'react';
import { medicines as exampleMedicines } from '../components/Search/medicineData';
import type { Medicine } from '../components/Search/types';
import { useStoredMedicationData } from '../hooks/useStoredMedicationData';
import { emptyCabinet, readCabinet } from '../utils/medicationStorage';
import { createMedicationSchedules, getTodayDoses, type MedicationScheduleInput, type MedicationSchedule } from '../utils/medicationSchedule';
import { useAuth } from './AuthProvider';
import { MedicationContext } from './MedicationContext';

type MedicationProviderProps = {
  children: ReactNode;
  familySchedules?: MedicationSchedule[];
};

export function MedicationProvider({ children, familySchedules }: MedicationProviderProps) {
  const parent = useContext(MedicationContext);
  const { accountId } = useAuth();
  const { data, update, clear } = useStoredMedicationData(
    !parent && !familySchedules && accountId !== null ? `onyak.personal-medications.${accountId}` : null,
    emptyCabinet, readCabinet,
  );
  const [recent, setRecent] = useState<{ accountId: number | null; items: Medicine[] }>({ accountId, items: [] });
  const recentMedicines = recent.accountId === accountId ? recent.items : [];
  const medicines = parent?.medicines ?? [
    ...exampleMedicines,
    ...data.medicines.filter(item => !recentMedicines.some(recent => recent.id === item.id)),
    ...recentMedicines,
  ];
  const schedules = familySchedules ?? data.schedules;
  const medicineIds = familySchedules ? [...new Set(familySchedules.map(schedule => schedule.medicineId))] : data.medicineIds;

  function rememberMedicine(medicine: Medicine) {
    if (parent) {
      parent.rememberMedicine(medicine);
    } else if (medicine.id.startsWith('drug-')) {
      setRecent(current => ({
        accountId,
        items: [...(current.accountId === accountId ? current.items.filter(item => item.id !== medicine.id) : []), medicine].slice(-20),
      }));
    }
  }

  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timer = setTimeout(() => setToday(new Date()), midnight.getTime() - now.getTime());
    return () => clearTimeout(timer);
  }, [today]);

  const todayDoses = getTodayDoses(medicineIds, schedules, today)
    .map(dose => ({ ...dose, completed: data.completedDoseIds.includes(dose.doseId) }));

  function registerMedicine(current: typeof data, id: string, selected?: Medicine) {
    const medicine = selected ?? medicines.find(item => item.id === id);
    return {
      ...current,
      medicineIds: current.medicineIds.includes(id) ? current.medicineIds : [...current.medicineIds, id],
      medicines: medicine && id.startsWith('drug-')
        ? [...current.medicines.filter(item => item.id !== id), medicine] : current.medicines,
    };
  }

  function toggleMedicine(id: string) {
    if (familySchedules) return;
    update(current => current.medicineIds.includes(id)
      ? {
        ...current,
        medicineIds: current.medicineIds.filter(item => item !== id),
        medicines: current.medicines.filter(medicine => medicine.id !== id),
        schedules: current.schedules.filter(schedule => schedule.medicineId !== id),
      }
      : registerMedicine(current, id));
  }

  function saveMedicationSchedule(medicineId: string, startDate: string, durationDays: number, doses: MedicationScheduleInput['doses'], medicine?: Medicine) {
    if (familySchedules) return;
    const newSchedules = createMedicationSchedules(medicineId, { startDate, durationDays, doses });
    update(current => ({
      ...registerMedicine(current, medicineId, medicine),
      schedules: [...current.schedules.filter(schedule => schedule.medicineId !== medicineId), ...newSchedules],
    }));
  }

  function toggleDose(doseId: string) {
    if (!todayDoses.some(dose => dose.doseId === doseId)) return;
    const date = doseId.slice(0, 10);
    update(current => {
      const ids = current.completedDoseIds.filter(id => id.startsWith(date + ':'));
      return { ...current, completedDoseIds: ids.includes(doseId) ? ids.filter(id => id !== doseId) : [...ids, doseId] };
    });
  }

  return (
    <MedicationContext.Provider value={{
      medicineIds, medicines, rememberMedicine, toggleMedicine, clearPersonalMedications: () => { clear(); setRecent({ accountId, items: [] }); }, schedules, saveMedicationSchedule, todayDoses, toggleDose,
    }}>
      {children}
    </MedicationContext.Provider>
  );
}
