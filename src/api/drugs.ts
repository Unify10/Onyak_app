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
};

export type DrugInformation = { efficacy?: string | null; usage?: string | null; caution?: string | null };

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
    information: { efficacy: result.efficacy, usage: result.usage, caution: result.caution },
  };
}
