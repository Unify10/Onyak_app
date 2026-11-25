import { getWardGuardianName, isWardSession } from './auth';
import { requestApi } from './client';

export type WardSignupInput = {
  name: string;
  birth_date: string;
  weight: number;
  height: number;
  gender: 'M' | 'F';
  is_pregnant: boolean;
  medication_push_enabled: boolean;
  sos_push_enabled: boolean;
};

export type WardInvitation = { code: string; qrToken: string; expiresAt: number };
export type WardLoginInput = { code: string } | { qr_token: string };

type WardSignupResponse = {
  ward_id?: number;
  link_code_response?: { code?: string; qr_token?: string; expires_at?: string };
};

export async function signupWard(body: WardSignupInput, accessToken: string, signal: AbortSignal) {
  const result = await requestApi<WardSignupResponse>('/ward/auth/signup', { body, accessToken, signal, privateRequest: true });
  const invitation = result?.link_code_response;
  const expiresAt = Date.parse(invitation?.expires_at ?? '');
  if (!invitation?.code || !/^\d{6}$/.test(invitation.code) || !invitation.qr_token || !Number.isFinite(expiresAt)) {
    throw new Error('서버에서 발급한 연동 코드 정보를 확인할 수 없어요. 가족 목록에서 등록 여부를 확인해 주세요.');
  }
  const issuedInvitation: WardInvitation = { code: invitation.code, qrToken: invitation.qr_token, expiresAt };
  return { wardId: result.ward_id, invitation: issuedInvitation };
}

export async function loginWard(body: WardLoginInput, signal: AbortSignal) {
  const session = await requestApi<unknown>('/ward/auth/login', { body, signal, privateRequest: true });
  if (!isWardSession(session)) throw new Error('서버에서 피보호자 로그인 정보를 받지 못했어요.');
  return { session, guardianName: getWardGuardianName(session) };
}
