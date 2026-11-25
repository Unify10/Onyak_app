import { ApiError, requestApi } from './client';
import { getDrugDur, readDrugFindings, type DrugFinding } from './drugs';
import { getFamilyProfile } from './family';
import { calculateAge } from '../utils/personalInfo';

type MedicationInteraction = { kind: string; severity: string; item_names: string[]; detail: string | null };
type CheckPatient = { age?: number | null; pregnant?: boolean | null };
type PrecheckResponse = {
  ward_id: number;
  patient: CheckPatient;
  level: 'DANGER' | 'CAUTION' | 'OK' | 'UNKNOWN';
  headline: string;
  already_taking: boolean;
  drug: { drug_id: string | null; item_name: string; findings: unknown; lookup_failed: boolean };
  interactions: MedicationInteraction[];
  warnings: string[];
  disclaimer: string | null;
};

export type WardMedicationCheck =
  | { status: 'precheck'; report: PrecheckResponse; findings?: DrugFinding[] }
  | { status: 'dur-only'; patient: CheckPatient; findings?: DrugFinding[] };

export async function checkWardMedication(
  wardId: number,
  drugId: string,
  accessToken: string,
  signal: AbortSignal,
): Promise<WardMedicationCheck> {
  try {
    const report = await requestApi<PrecheckResponse>(`/wards/${wardId}/medications/precheck`, {
      body: { item_seq: drugId },
      accessToken,
      signal,
      privateRequest: true,
    });
    if (report?.ward_id !== wardId
      || !report.drug
      || (report.drug.drug_id !== drugId && !(report.drug.lookup_failed && report.drug.drug_id === null))
      || !['DANGER', 'CAUTION', 'OK', 'UNKNOWN'].includes(report.level)
      || typeof report.headline !== 'string'
      || !Array.isArray(report.interactions)
      || !report.interactions.every(item => item && typeof item.kind === 'string'
        && Array.isArray(item.item_names) && item.item_names.every(name => typeof name === 'string'))
      || !Array.isArray(report.warnings) || !report.warnings.every(warning => typeof warning === 'string')) {
      throw new Error('서버의 복용 점검 결과를 읽지 못했어요.');
    }
    const findings = report.drug.lookup_failed ? undefined : readDrugFindings(report.drug);
    if (report.level === 'OK' && !findings) {
      throw new Error('서버의 복용 점검 결과를 읽지 못했어요.');
    }
    return { status: 'precheck', report, findings };
  } catch (error) {
    if (!(error instanceof ApiError)
      || !([404, 405].includes(error.status) || error.status >= 500)
      || error.code === 'DRUG_NOT_FOUND'
      || error.code === 'WARD_NOT_FOUND') throw error;
  }

  const profile = await getFamilyProfile(String(wardId), accessToken, signal);
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const koreanDate = new Date(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
  const ageText = calculateAge(profile.birth_date ?? '', koreanDate);
  const age = ageText && Number(ageText) <= 120 ? Number(ageText) : undefined;
  const pregnant = typeof profile.is_pregnant === 'boolean' ? profile.is_pregnant : undefined;
  if (age === undefined && pregnant === undefined) {
    throw new Error('피보호자의 나이와 임신 여부를 확인할 수 없어 점검하지 못했어요.');
  }
  const patient = { age, pregnant };
  const findings = await getDrugDur(drugId, patient, accessToken, signal);
  return { status: 'dur-only', patient, findings };
}
