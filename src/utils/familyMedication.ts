import type { FamilyMedication } from '../api/family';
import { getLocalDateKey } from './medicationSchedule';

export function getFamilyMedicationDoses(medications: FamilyMedication[], date: Date) {
  const dateKey = getLocalDateKey(date);
  return medications
    .filter(medication => medication.start_date <= dateKey
      && (medication.end_date ? dateKey <= medication.end_date : medication.active))
    .flatMap(medication => medication.schedule_times.map(time => ({
      id: `${medication.medication_id}:${time}`,
      name: medication.drug_name,
      medicationId: medication.medication_id,
      active: medication.active,
      time,
    })))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getMedicationServerClock(now = new Date()) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return {
    date: new Date(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()),
    minutes: kst.getUTCHours() * 60 + kst.getUTCMinutes(),
  };
}
