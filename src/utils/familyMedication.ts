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
      time,
    })))
    .sort((a, b) => a.time.localeCompare(b.time));
}
