import AsyncStorage from '@react-native-async-storage/async-storage';

let pendingWrite = Promise.resolve();

export async function readStoredAccountData(key: string): Promise<unknown> {
  await pendingWrite;
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : undefined;
}

export function writeStoredAccountData(key: string, value?: unknown) {
  const save = () => value === undefined ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, JSON.stringify(value));
  pendingWrite = pendingWrite.then(save).catch(() => {});
  return pendingWrite;
}
