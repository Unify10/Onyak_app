import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type NotificationPreferences = {
  allEnabled: boolean;
  medicationEnabled: boolean;
  sosEnabled: boolean;
  serviceEnabled: boolean;
};

type NotificationContextValue = NotificationPreferences & {
  setAllEnabled: (enabled: boolean) => void;
  setMedicationEnabled: (enabled: boolean) => void;
  setSosEnabled: (enabled: boolean) => void;
  setServiceEnabled: (enabled: boolean) => void;
  hasUnreadNotifications: boolean;
  markAllRead: () => void;
  markNotificationUnread: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    allEnabled: true,
    medicationEnabled: true,
    sosEnabled: true,
    serviceEnabled: true,
  });
  // The prototype starts with sample notifications. A real push event can call markNotificationUnread.
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const setAllEnabled = useCallback((enabled: boolean) => setPreferences(current => ({ ...current, allEnabled: enabled })), []);
  const setMedicationEnabled = useCallback((enabled: boolean) => setPreferences(current => ({ ...current, medicationEnabled: enabled })), []);
  const setSosEnabled = useCallback((enabled: boolean) => setPreferences(current => ({ ...current, sosEnabled: enabled })), []);
  const setServiceEnabled = useCallback((enabled: boolean) => setPreferences(current => ({ ...current, serviceEnabled: enabled })), []);
  const markAllRead = useCallback(() => setHasUnreadNotifications(false), []);
  const markNotificationUnread = useCallback(() => setHasUnreadNotifications(true), []);

  const value = useMemo(() => ({
    ...preferences,
    setAllEnabled,
    setMedicationEnabled,
    setSosEnabled,
    setServiceEnabled,
    hasUnreadNotifications,
    markAllRead,
    markNotificationUnread,
  }), [preferences, hasUnreadNotifications, setAllEnabled, setMedicationEnabled, setSosEnabled, setServiceEnabled, markAllRead, markNotificationUnread]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationContext);
  if (!value) throw new Error('알림 제공자가 필요합니다.');
  return value;
}
