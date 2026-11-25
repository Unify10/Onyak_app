import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getFamilyMedications } from '../api/family';
import { checkFamilyMedication } from '../api/medications';
import type { Medicine } from '../components/Search/types';
import { useMedicationMutation } from '../hooks/useMedicationMutation';
import { useProtectedQuery } from '../hooks/useProtectedQuery';
import { useWardCalendar } from '../hooks/useWardCalendar';
import { getMedicationServerClock } from '../utils/familyMedication';
import { getLocalDateKey, getTodayDoses, type MedicationSchedule } from '../utils/medicationSchedule';
import { MedicationContext } from './MedicationContext';

const unchanged = () => {};
const everyDay = [0, 1, 2, 3, 4, 5, 6];

export default function WardMedicationProvider({ wardId, children }: { wardId: string; children: ReactNode }) {
  const [clock, setClock] = useState(getMedicationServerClock);
  const [checked, setChecked] = useState<{ date: string; ids: string[] }>();
  const query = useCallback((token: string, signal: AbortSignal) => getFamilyMedications(wardId, token, signal), [wardId]);
  const { state, retry } = useProtectedQuery(query, true, 'dependent');
  const calendar = useWardCalendar(wardId, clock.date, 'dependent', clock.date.getTime());
  const mutation = useMedicationMutation();

  useEffect(() => {
    const timer = setInterval(() => setClock(getMedicationServerClock()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const records = state.status === 'ready' ? state.data : [];
  const active = records.filter(item => item.active);
  const medicines: Medicine[] = active.map(item => ({
    id: String(item.medication_id),
    name: item.drug_name,
    kind: '',
    ingredient: '',
    category: '의약품',
  }));
  const medicineIds = medicines.map(item => item.id);
  const schedules: MedicationSchedule[] = active.flatMap(item => item.schedule_times.map(time => ({
    id: `${item.medication_id}:${time}`,
    medicineId: String(item.medication_id),
    daysOfWeek: everyDay,
    time,
    startDate: item.start_date,
    endDate: item.end_date ?? undefined,
  })));

  const dateKey = getLocalDateKey(clock.date);
  const todayRecord = calendar.state.status === 'ready' ? calendar.state.data.find(day => day.date === dateKey) : undefined;
  const todayDoses = getTodayDoses(medicineIds, schedules, clock.date).map(dose => ({
    ...dose,
    completed: checked?.date === dateKey && checked.ids.includes(dose.doseId),
  }));

  async function toggleDose(doseId: string) {
    const dose = todayDoses.find(item => item.doseId === doseId);
    if (!dose || dose.completed || dateKey !== getLocalDateKey(getMedicationServerClock().date)) return;
    const saved = await mutation.run((token, signal) => checkFamilyMedication(Number(dose.medicineId), dose.time, token, signal));
    if (!saved) return;
    setChecked(current => ({
      date: dateKey,
      ids: [...(current?.date === dateKey ? current.ids : []), doseId],
    }));
    calendar.retry();
  }

  return (
    <MedicationContext.Provider value={{
      medicines,
      medicineIds,
      schedules,
      todayDoses,
      toggleDose: id => void toggleDose(id),
      toggleMedicine: unchanged,
      rememberMedicine: unchanged,
      saveMedicationSchedule: unchanged,
      ward: {
        id: wardId,
        records,
        loading: state.status === 'loading',
        loadError: state.status === 'error' ? state.message : undefined,
        retry: () => {
          retry();
          calendar.retry();
        },
        checkBusy: mutation.busy,
        checkError: mutation.error,
        todayRecord,
        todayRecordLoading: calendar.state.status === 'loading',
        todayRecordError: calendar.state.status === 'error' ? calendar.state.message : undefined,
        retryTodayRecord: calendar.retry,
      },
    }}>
      {children}
    </MedicationContext.Provider>
  );
}
