import Text from '../../components/Typography/Text';
import { withdrawAccount } from '../../api/profile';
import { useAccountMutation } from '../../hooks/useAccountMutation';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../providers/ProfileProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useMedications } from '../../providers/MedicationContext';
import { writeConfirmedHeight } from '../../utils/accountSessionStorage';
import { useSearchHistory } from '../../providers/SearchHistoryProvider';

export default function DeleteAccountScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { clearFamilies } = useFamilies();
  const [checked, setChecked] = useState(false);
  const { resetProfile } = useProfile();
  const { accountId, clearLocalSession } = useAuth();
  const { clearSearches } = useSearchHistory();
  const { clearPersonalMedications } = useMedications();
  const { busy, error, run } = useAccountMutation('회원 탈퇴를 완료하지 못했어요.');
  const disabled = !checked || busy || accountId === null;

  async function withdraw() {
    if (disabled || accountId === null) return;
    const result = await run(withdrawAccount);
    if (!result.ok) return;
    void writeConfirmedHeight(accountId, null).catch(() => {});
    resetProfile();
    clearSearches();
    clearFamilies();
    clearPersonalMedications?.();
    clearLocalSession();
    router.replace('/login');
  }

  return (
    <View style={styles.screen}>
      <Pressable accessibilityRole="button" accessibilityLabel="내 정보로 돌아가기" disabled={busy} onPress={() => router.replace('/my-info')} style={styles.header}>
        <Ionicons name="chevron-back" size={22} />
        <Text style={styles.title}>회원 탈퇴</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>회원 탈퇴</Text>
        <Text style={styles.description}>탈퇴하면 보호자 계정과 연결된 가족 계정, 복약 기록, 알림이 삭제돼요. 삭제한 데이터는 복구할 수 없어요.</Text>
        <Pressable accessibilityRole="checkbox" accessibilityState={{ checked, disabled: busy }} disabled={busy} onPress={() => setChecked(value => !value)} style={styles.checkbox}>
          <Ionicons name={checked ? 'checkbox' : 'square-outline'} size={24} />
          <Text style={styles.label}>위 내용을 확인했습니다.</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityState={{ busy, disabled }} disabled={disabled} onPress={() => void withdraw()} style={[styles.button, disabled && styles.disabled]}>
          <Text style={styles.buttonText}>{busy ? '탈퇴 처리 중' : '탈퇴하고 로그아웃'}</Text>
        </Pressable>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
    </View>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20 },
  title: { fontSize: 16 },
  content: { width: '100%', alignSelf: 'center', padding: 20 },
  heading: { fontSize: 22, lineHeight: 32, marginBottom: 24 },
  description: { color: '#6B7280', fontSize: 15, lineHeight: 25 },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 28, minHeight: 48 },
  label: { flex: 1, fontSize: 14, lineHeight: 22 },
  button: { minHeight: 50, backgroundColor: '#B42318', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.4 },
  buttonText: { color: '#FFFFFF', fontSize: 16 },
  error: { color: '#B42318', fontSize: 14, marginTop: 12 },
});
