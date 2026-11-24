import { useEffect, useRef, useState } from 'react';
import { getAppInfo, type AppInfo } from '../api/appInfo';

type AppInfoState =
  | { status: 'loading' }
  | { status: 'success'; data: AppInfo }
  | { status: 'error'; message: string };

export function useAppInfo() {
  const [state, setState] = useState<AppInfoState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => {
      controller.abort();
      setState({ status: 'error', message: '응답이 지연되고 있어요. 다시 시도해 주세요.' });
    }, 10_000);

    void getAppInfo(controller.signal)
      .then(data => {
        if (!controller.signal.aborted) setState({ status: 'success', data });
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          const message = error instanceof Error && !(error instanceof TypeError)
            ? error.message
            : '앱 정보를 불러오지 못했어요.';
          setState({ status: 'error', message });
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [attempt]);

  function retry() {
    activeRequest.current?.abort();
    setState({ status: 'loading' });
    setAttempt(current => current + 1);
  }

  return { state, retry };
}
