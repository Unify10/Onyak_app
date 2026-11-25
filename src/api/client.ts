type Options = { method?: 'POST' | 'PATCH' | 'DELETE'; body?: object; formData?: FormData; signal?: AbortSignal; accessToken?: string; privateRequest?: boolean; timeoutMs?: number };

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  message?: string | null;
  error_code?: string;
  errors?: { message?: string }[] | null;
};

export class ApiError extends Error {
  constructor(readonly status: number, message: string, readonly code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function requestApi<T>(path: string, options: Options = {}): Promise<T> {
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, '');
  if (!baseUrl) throw new Error('서버 주소가 설정되지 않았어요.');
  if (options.privateRequest && !__DEV__ && !baseUrl.startsWith('https://')) {
    throw new Error('이 빌드에서 로그인과 개인정보를 사용하려면 HTTPS 서버 주소가 필요해요.');
  }

  const controller = new AbortController();
  const abortRequest = () => controller.abort();
  if (options.signal?.aborted) abortRequest();
  options.signal?.addEventListener('abort', abortRequest, { once: true });
  const timeout = setTimeout(abortRequest, options.timeoutMs ?? (options.formData ? 35_000 : 12_000));
  const headers = new Headers({ Accept: 'application/json' });
  if (options.body) headers.set('Content-Type', 'application/json');
  if (options.accessToken) headers.set('Authorization', `Bearer ${options.accessToken}`);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: options.method ?? (options.body || options.formData ? 'POST' : 'GET'),
      headers,
      body: options.formData ?? (options.body ? JSON.stringify(options.body) : undefined),
      signal: controller.signal,
      redirect: 'error',
    });
    if (response.status === 204 && options.method === 'DELETE' && !controller.signal.aborted) return undefined as T;
    const result = await response.json().catch(() => null) as ApiEnvelope<T> | null;
    if (controller.signal.aborted) throw new Error('서버 응답을 기다리는 시간이 초과됐어요.');
    if (!response.ok || !result?.success) {
      const details = result?.errors?.[0]?.message;
      const message = response.status >= 500 ? '서버에서 요청을 처리하지 못했어요.'
        : (details && /[가-힣]/.test(details) ? details : result?.message) || '요청을 처리하지 못했어요.';
      throw new ApiError(response.status, message, result?.error_code);
    }
    return result.data;
  } catch (error) {
    if (controller.signal.aborted) throw new Error('서버 응답을 기다리는 시간이 초과됐어요.');
    if (error instanceof TypeError) throw new Error('서버에 연결하지 못했어요. 네트워크를 확인해 주세요.');
    throw error;
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortRequest);
  }
}
