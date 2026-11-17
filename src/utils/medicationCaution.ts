import { calculateAge, type PersonalInfo } from './personalInfo';

type AgeRange =
  | { fromAge: number; throughAge?: number }
  | { fromAge?: number; throughAge: number };

export type MedicationContraindications = {
  ageRanges?: readonly AgeRange[];
  pregnancy?: boolean;
};

export function needsMedicationCaution(
  rules: MedicationContraindications | undefined,
  profile: PersonalInfo | undefined,
  today = new Date(),
) {
  if (!rules || !profile) return false;
  if (rules.pregnancy && profile.pregnancyStatusProvided && profile.pregnant) return true;

  const ageText = calculateAge(profile.birthDate, today) || profile.age;
  if (!/^\d{1,3}$/.test(ageText) || Number(ageText) > 150) return false;

  const age = Number(ageText);
  return rules.ageRanges?.some(range =>
    (range.fromAge === undefined || age >= range.fromAge) &&
    (range.throughAge === undefined || age <= range.throughAge),
  ) ?? false;
}
