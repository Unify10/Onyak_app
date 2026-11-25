import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { getNotificationPreferences, patchNotificationPreferences, type NotificationPreferences } from '../../api/profile';
import QueryError from '../../components/Feedback/QueryError';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { useAccountMutation } from '../../hooks/useAccountMutation';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../theme/tokens';

export default function NotificationSettingsScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { state, retry } = useProtectedQuery(getNotificationPreferences);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" accessibilityLabel="내 정보로 돌아가기" style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.title}>알림 설정</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {state.status === 'loading' ? <ListSkeleton label="알림 설정 불러오는 중" /> : state.status === 'error'
          ? <QueryError message={state.message} onRetry={retry} />
          : <NotificationPreferencesForm initial={state.data} />}
      </ScrollView>
    </View>
  );
}

function NotificationPreferencesForm({ initial }: { initial: NotificationPreferences }) {
  const styles = useResponsiveStyles(baseStyles);
  const [preferences, setPreferences] = useState(initial);
  const { busy, error, run } = useAccountMutation('알림 설정을 저장하지 못했어요.');
  const { medication_push_enabled: medication, sos_push_enabled: sos, marketing_push_enabled: marketing } = preferences;

  async function update(changes: Partial<NotificationPreferences>) {
    const result = await run((token, signal) => patchNotificationPreferences(changes, token, signal));
    if (result.ok) setPreferences(result.data);
  }

  function setAll(enabled: boolean) {
    void update({ medication_push_enabled: enabled, sos_push_enabled: enabled, marketing_push_enabled: enabled });
  }

  return (
    <>
      <View style={styles.group}>
        <SettingRow title="전체 푸시 알림" description="아래 세 종류의 알림을 한 번에 켜거나 꺼요." value={medication || sos || marketing} onValueChange={setAll} disabled={busy} />
      </View>
      <Text style={styles.sectionTitle}>알림 종류</Text>
      <View style={styles.group}>
        <SettingRow title="복약 알림" description="등록한 복용 시간에 맞춰 알려드려요." value={medication} onValueChange={value => void update({ medication_push_enabled: value })} disabled={busy} />
        <View style={styles.divider} />
        <SettingRow title="SOS 알림" description="가족 계정의 긴급 알림을 받아요." value={sos} onValueChange={value => void update({ sos_push_enabled: value })} disabled={busy} />
        <View style={styles.divider} />
        <SettingRow title="공지·서비스 알림" description="공지사항과 서비스 안내를 받아요." value={marketing} onValueChange={value => void update({ marketing_push_enabled: value })} disabled={busy} />
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Text style={styles.note}>수신 설정은 계정에 저장돼요. 기기 푸시는 서버 발송 기능이 연결되면 받을 수 있어요.</Text>
    </>
  );
}

function SettingRow({ title, description, value, onValueChange, disabled = false }: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch accessibilityLabel={title} value={value} onValueChange={onValueChange} disabled={disabled} trackColor={{ false: '#D0D5DD', true: '#111111' }} />
    </View>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.pageTitle },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  group: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 16 },
  sectionTitle: { color: '#667085', fontSize: 14, lineHeight: 20, marginTop: 12 },
  row: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowText: { flex: 1, gap: 3 },
  rowTitle: { fontSize: 16, lineHeight: 22, color: '#111111' },
  rowDescription: { fontSize: 13, lineHeight: 18, color: '#7B8494' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB' },
  disabled: { opacity: 0.45 },
  error: { color: '#B42318', fontSize: 14 },
  note: { fontSize: 12, lineHeight: 18, color: '#8B929D', marginTop: 8 },
});
