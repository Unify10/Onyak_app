import type { FamilyDraft } from '../providers/FamilyProvider';

export function findInvitedFamily(families: FamilyDraft[], code: string, expiresAt?: number) {
  const matches = families.filter(family =>
    family.code === code &&
    family.expiresAt > Date.now() &&
    (expiresAt === undefined || family.expiresAt === expiresAt)
  );
  return matches.length === 1 ? matches[0] : undefined;
}

export function readFamilyQr(data: string) {
  try {
    const value = JSON.parse(data);
    if (value?.type === 'onyak-demo-family' &&
        typeof value.code === 'string' && /^\d{6}$/.test(value.code) &&
        typeof value.expiresAt === 'number' && Number.isFinite(value.expiresAt)) {
      return { code: value.code as string, expiresAt: value.expiresAt as number };
    }
  } catch {
    // 온약 형식이 아닌 QR은 인증에 사용하지 않습니다.
  }
}

const testDependent = { id: 'test-dependent', name: '테스트 피보호자', code: '246810' };

export function getTestDependent() {
  return __DEV__ ? testDependent : undefined;
}

export type FamilyInvitation = { code: string; expiresAt: number };

export function createFamilyInvitation(existingCodes: readonly string[]): FamilyInvitation {
  const reserved = new Set([...existingCodes, testDependent.code]);
  let number = Math.floor(Math.random() * 1_000_000);
  let code = String(number).padStart(6, '0');
  while (reserved.has(code)) {
    number = (number + 1) % 1_000_000;
    code = String(number).padStart(6, '0');
  }
  return { code, expiresAt: Date.now() + 10 * 60 * 1000 };
}
