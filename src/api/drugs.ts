import type { Medicine } from '../components/Search/types';
import { requestApi } from './client';

type DrugRecord = {
  drug_id: string;
  item_name: string;
  main_ingredient?: string | null;
  classification?: string | null;
};

type DrugDetailRecord = DrugRecord & {
  efficacy?: string | null;
  usage?: string | null;
  caution?: string | null;
  evidences?: unknown;
};

export type DrugInformation = {
  efficacy?: string | null;
  usage?: string | null;
  caution?: string | null;
  classification?: string | null;
  classificationEvidence?: string[];
};

function toMedicine(record: DrugRecord): Medicine {
  if (!/^\d{1,20}$/.test(record.drug_id) || typeof record.item_name !== 'string' || !record.item_name.trim()) {
    throw new Error('서버에서 약품 정보를 읽지 못했어요.');
  }
  const category = record.classification === '일반의약품' ? '일반의약품'
    : record.classification === '영양제' || record.classification === '건강기능식품' ? '영양제' : '의약품';

  return {
    id: `drug-${record.drug_id}`,
    name: record.item_name,
    ingredient: record.main_ingredient ?? '',
    kind: record.classification ?? '',
    category,
  };
}

export async function searchDrugs(query: string, accessToken: string, signal: AbortSignal) {
  const result = await requestApi<{ items: DrugRecord[] }>(`/drugs/search?q=${encodeURIComponent(query)}&limit=20`, {
    accessToken, signal, privateRequest: true,
  });
  if (!Array.isArray(result?.items)) throw new Error('서버에서 검색 결과를 읽지 못했어요.');
  return result.items.map(toMedicine);
}

export async function getDrugDetail(drugId: string, accessToken: string, signal: AbortSignal) {
  const result = await requestApi<DrugDetailRecord>(`/drugs/${encodeURIComponent(drugId)}`, {
    accessToken, signal, privateRequest: true,
  });
  if (!result || String(result.drug_id) !== drugId) throw new Error('서버에서 약품 정보를 읽지 못했어요.');
  return {
    medicine: toMedicine(result),
    information: {
      efficacy: result.efficacy,
      usage: result.usage,
      caution: result.caution,
      classification: result.classification,
      classificationEvidence: Array.isArray(result.evidences) ? result.evidences.flatMap(value => {
        const evidence = asRecord(value);
        const detail = stringValue(evidence?.detail);
        const source = stringValue(evidence?.source);
        return detail ? [[source, detail].filter(Boolean).join(' · ')] : [];
      }) : undefined,
    },
  };
}

export type DrugImage = { uri: string; name?: string | null; mimeType?: string; size?: number; file?: File };
export type DrugImageAction = 'ocr' | 'analyze';
export type DrugCandidate = { name: string; drugId?: string };
export type DrugFinding = { label: string; severity?: '금기' | '주의'; details: string[] };

type DrugCheckInput = { age?: number; pregnant?: boolean };

export async function lookupDrugBarcode(code: string, accessToken: string, signal: AbortSignal) {
  const result = await requestApi<unknown>(`/drugs/barcode/${encodeURIComponent(code)}`, { accessToken, signal, privateRequest: true });
  const record = asRecord(result);
  const drug = asRecord(record?.drug);
  const id = readDrugId(record) ?? readDrugId(drug);
  if (!id) throw new Error('바코드에 해당하는 약품을 확인하지 못했어요.');
  return getDrugDetail(id, accessToken, signal);
}

export async function getDrugDur(drugId: string, input: DrugCheckInput, accessToken: string, signal: AbortSignal) {
  const query = new URLSearchParams();
  if (input.age !== undefined) query.set('age', String(input.age));
  if (input.pregnant !== undefined) query.set('pregnant', String(input.pregnant));
  const params = query.toString();
  const result = await requestApi<unknown>(`/drugs/${encodeURIComponent(drugId)}/dur${params ? `?${params}` : ''}`, {
    accessToken, signal, privateRequest: true,
  });
  return readDrugFindings(result);
}

export async function recognizeDrugImage(image: DrugImage, action: DrugImageAction, input: DrugCheckInput, accessToken: string, signal: AbortSignal) {
  const maxImageSize = 10 * 1024 * 1024;
  const formData = new FormData();
  if ((image.file?.size ?? image.size ?? 0) > maxImageSize) {
    throw new Error('10MB 이하의 사진을 선택해 주세요.');
  }
  if (image.file) {
    formData.append('file', image.file);
  } else if (image.uri.startsWith('data:') || image.uri.startsWith('blob:')) {
    const response = await fetch(image.uri, { signal });
    const blob = await response.blob();
    if (blob.size > maxImageSize) throw new Error('10MB 이하의 사진을 선택해 주세요.');
    formData.append('file', blob, image.name ?? 'label.jpg');
  } else {
    const file = { uri: image.uri, name: image.name ?? 'label.jpg', type: image.mimeType ?? 'image/jpeg' };
    // React Native는 multipart 파일에 URI 객체를 사용해요.
    formData.append('file', file as unknown as Blob);
  }
  if (action === 'analyze') {
    if (input.age !== undefined) formData.append('age', String(input.age));
    if (input.pregnant !== undefined) formData.append('pregnant', String(input.pregnant));
  }

  const result = await requestApi<unknown>(`/drugs/${action}`, { formData, accessToken, signal, privateRequest: true });
  return { candidates: readDrugCandidates(result), findings: action === 'analyze' ? readDrugFindings(result) : undefined };
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function readDrugId(record?: Record<string, unknown>) {
  const id = String(record?.drug_id ?? record?.item_seq ?? '');
  return /^\d{1,20}$/.test(id) ? id : undefined;
}

function readDrugCandidates(result: unknown): DrugCandidate[] {
  const record = asRecord(result);
  const ocr = asRecord(record?.ocr);
  const rows = record?.candidates ?? ocr?.candidates ?? record?.matches ?? record?.items ?? record?.medications;
  const candidates = Array.isArray(rows) ? rows : [record?.drug ?? record?.match ?? record];
  const found = new Map<string, DrugCandidate>();
  for (const value of candidates) {
    const row = asRecord(value);
    const drug = asRecord(row?.drug) ?? row;
    const name = stringValue(drug?.item_name ?? drug?.name ?? drug?.drug_name ?? value);
    if (!name) continue;
    const drugId = readDrugId(drug);
    found.set(drugId ?? name, { name, drugId });
  }
  return [...found.values()];
}

export function readDrugFindings(result: unknown): DrugFinding[] | undefined {
  const record = asRecord(result);
  const dur = asRecord(record?.dur);
  const analysis = asRecord(record?.analysis);
  const findings = record?.findings ?? dur?.findings ?? analysis?.findings;
  if (!Array.isArray(findings)) return undefined;
  const rows: DrugFinding[] = findings.flatMap(value => {
    const finding = asRecord(value);
    const label = stringValue(finding?.check_label);
    const details = [finding?.prohibit_content, finding?.remark, finding?.counterpart].map(stringValue).filter(Boolean);
    const severity = finding?.severity === 'CONTRAINDICATED' ? '금기' : finding?.severity === 'CAUTION' ? '주의' : undefined;
    return label ? [{ label, severity, details }] : [];
  });
  return rows.length === findings.length ? rows : undefined;
}
