import { requestApi } from './client';
import { readDrugFindings, type DrugFinding } from './drugs';

export type EvidenceCardMedication = {
  medication_id: number;
  item_name: string | null;
  classification: string | null;
  lookup_failed: boolean;
  has_warning: boolean;
  findings?: DrugFinding[];
  evidences: { source: string | null; detail: string | null }[];
};

export type EvidenceCard = {
  ward_id: number;
  ward_name: string;
  generated_at: string;
  level: string;
  headline: string;
  medications: EvidenceCardMedication[];
  interactions: { kind: string; severity: string; item_names: string[]; detail: string | null }[];
  warnings: string[];
  disclaimer: string | null;
};

function isTextOrNull(value: unknown) {
  return value === null || typeof value === 'string';
}

export async function getEvidenceCard(wardId: string, accessToken: string, signal: AbortSignal) {
  const result = await requestApi<EvidenceCard>(`/wards/${encodeURIComponent(wardId)}/evidence-card`, {
    accessToken, signal, privateRequest: true, timeoutMs: 20_000,
  });
  if (String(result?.ward_id) !== wardId || typeof result.ward_name !== 'string'
    || typeof result.headline !== 'string' || typeof result.level !== 'string'
    || !Number.isFinite(Date.parse(result.generated_at)) || !isTextOrNull(result.disclaimer)
    || !Array.isArray(result.medications) || !result.medications.every(medication => medication
      && Number.isInteger(medication.medication_id) && isTextOrNull(medication.item_name)
      && typeof medication.lookup_failed === 'boolean' && typeof medication.has_warning === 'boolean'
      && isTextOrNull(medication.classification) && Array.isArray(medication.evidences)
      && medication.evidences.every(evidence => evidence && isTextOrNull(evidence.source) && isTextOrNull(evidence.detail)))
    || !Array.isArray(result.interactions) || !result.interactions.every(interaction => interaction
      && typeof interaction.kind === 'string' && typeof interaction.severity === 'string'
      && isTextOrNull(interaction.detail) && Array.isArray(interaction.item_names)
      && interaction.item_names.every(name => typeof name === 'string'))
    || !Array.isArray(result.warnings) || !result.warnings.every(warning => typeof warning === 'string')) {
    throw new Error('서버의 복약 확인 근거 카드를 읽지 못했어요.');
  }
  return {
    ...result,
    medications: result.medications.map(medication => ({
      ...medication,
      findings: medication.lookup_failed ? undefined : readDrugFindings(medication),
    })),
  };
}
