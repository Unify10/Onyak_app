import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useNotifications } from '../../providers/NotificationProvider';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { typography } from '../../theme/tokens';

export default function NotificationSettingsScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const {
    allEnabled,
    setAllEnabled,
    medicationEnabled,
    setMedicationEnabled,
    sosEnabled,
    setSosEnabled,
    serviceEnabled,
    setServiceEnabled,
  } = useNotifications();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" accessibilityLabel="내 정보로 돌아가기" style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.title}>알림 설정</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.group}>
          <SettingRow title="전체 푸시 알림" description="온약에서 보내는 푸시 알림을 모두 설정합니다." value={allEnabled} onValueChange={setAllEnabled} />
        </View>
        <Text style={styles.sectionTitle}>알림 종류</Text>
        <View style={styles.group}>
          <SettingRow title="복약 알림" description="등록한 복용 시간에 맞춰 알려드려요." value={medicationEnabled} onValueChange={setMedicationEnabled} disabled={!allEnabled} />
          <View style={styles.divider} />
          <SettingRow title="SOS 알림" description="가족 계정의 긴급 알림을 받아요." value={sosEnabled} onValueChange={setSosEnabled} disabled={!allEnabled} />
          <View style={styles.divider} />
          <SettingRow title="공지·서비스 알림" description="공지사항과 서비스 안내를 받아요." value={serviceEnabled} onValueChange={setServiceEnabled} disabled={!allEnabled} />
        </View>
        <Text style={styles.note}>현재 화면은 설정 미리보기입니다. 실제 푸시 수신은 알림 서비스 연동 후 사용할 수 있습니다.</Text>
      </ScrollView>
    </View>
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
  note: { fontSize: 12, lineHeight: 18, color: '#8B929D', marginTop: 8 },
});
