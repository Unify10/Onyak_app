import { useCallback, useEffect, useState } from 'react';
import { readStoredAccountData, writeStoredAccountData } from '../utils/accountDataStorage';

type Update<T> = (data: T) => T;
type Snapshot<T> = { key: string | null; data: T; loaded: boolean; updates: Update<T>[]; dirty: boolean };

export function useStoredAccountData<T>(key: string | null, initial: T, parse: (value: unknown) => T) {
  const [snapshot, setSnapshot] = useState<Snapshot<T>>({ key, data: initial, loaded: !key, updates: [], dirty: false });
  const current = snapshot.key === key ? snapshot : { key, data: initial, loaded: !key, updates: [], dirty: false };

  useEffect(() => {
    if (!key) return;
    let active = true;
    void readStoredAccountData(key).then(parse).catch(() => initial).then(stored => {
      if (!active) return;
      setSnapshot(snapshot => {
        if (snapshot.key === key && snapshot.loaded) return snapshot;
        const updates = snapshot.key === key ? snapshot.updates : [];
        return { key, data: updates.reduce((data, update) => update(data), stored), loaded: true, updates: [], dirty: updates.length > 0 };
      });
    });
    return () => { active = false; };
  }, [initial, key, parse]);

  useEffect(() => {
    if (key && snapshot.key === key && snapshot.loaded && snapshot.dirty) {
      void writeStoredAccountData(key, snapshot.data);
    }
  }, [key, snapshot]);

  const update = useCallback((apply: Update<T>) => {
    setSnapshot(snapshot => {
      const previous = snapshot.key === key ? snapshot : { key, data: initial, loaded: !key, updates: [], dirty: false };
      return {
        ...previous,
        data: apply(previous.data),
        updates: previous.loaded ? [] : [...previous.updates, apply],
        dirty: true,
      };
    });
  }, [initial, key]);

  const clear = useCallback(() => {
    if (key) void writeStoredAccountData(key);
    setSnapshot({ key, data: initial, loaded: true, updates: [], dirty: false });
  }, [initial, key]);

  return { data: current.data, update, clear };
}
