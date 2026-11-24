import RoundBackButton from '../../components/Navigation/RoundBackButton';
import Text from '../../components/Typography/Text';
import { useSaveBodyProfile } from '../../hooks/useSaveBodyProfile';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { useProfile } from '../../providers/ProfileProvider';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import { calculateAge, validatePersonalInfo } from '../../utils/personalInfo';
import TextInput from '../../components/Typography/TextInput';
import { Ionicons } from '@expo/vector-icons';

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits.length === 10
    ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
    : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function EditProfileScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { profile, saveProfile } = useProfile();
  const { displayName, email, contactNumber, updateDisplayName, updateContactNumber, updateEmail, updatePassword } = useAuth();
  const activeTab = tab === 'body' ? 'body' : 'personal';
  const [draft, setDraft] = useState(() => ({ ...profile, name: displayName }));
  const [phone, setPhone] = useState(contactNumber);
  const [emailDraft, setEmailDraft] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState({ current: false, next: false, confirmation: false });
  const [error, setError] = useState('');
  const { saveBody, saving, saveError, clearSaveError } = useSaveBodyProfile();

  async function save() {
    if (saving) return;
    clearSaveError();
    const bodyDraft = {
      ...draft,
      name: draft.name.trim() || '사용자',
      age: calculateAge(draft.birthDate),
      height: draft.height.trim().replace(',', '.'),
      weight: draft.weight.trim().replace(',', '.'),
    };
    const changingPassword = activeTab === 'personal' && !!(currentPassword || newPassword || passwordConfirmation);
    let message = activeTab === 'personal'
      ? validatePersonalInfo({ ...draft, age: '', height: '', weight: '' })
      : validatePersonalInfo(bodyDraft);
    if (!message && activeTab === 'body' && Number(bodyDraft.weight) > 300) {
      message = '몸무게를 300kg 이하로 입력해 주세요.';
    }
    if (activeTab === 'personal') {
      if (!message && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft.trim())) message = '올바른 이메일 주소를 입력해주세요.';
      const phoneDigits = phone.replace(/\D/g, '');
      if (!message && phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 11)) message = '연락처를 10~11자리로 입력해주세요.';
      if (!message && changingPassword && !currentPassword) message = '현재 비밀번호를 입력해주세요.';
      if (!message && changingPassword && !(newPassword.length >= 8 && /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword))) message = '새 비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.';
      if (!message && changingPassword && newPassword === currentPassword) message = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
      if (!message && changingPassword && newPassword !== passwordConfirmation) message = '새 비밀번호가 일치하지 않습니다.';
    }
    setError(message);
    if (message) return;
    if (activeTab === 'body') {
      if (!(await saveBody(bodyDraft))) return;
    } else {
      saveProfile({ ...draft, name: draft.name.trim() });
      updateDisplayName(draft.name.trim());
      updateContactNumber(formatPhoneNumber(phone));
      updateEmail(emailDraft.trim());
      if (changingPassword) updatePassword(newPassword);
    }
    router.replace('/my-info');
  }
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerSpacer}>
          <RoundBackButton onPress={() => { if (!saving) router.replace('/my-info'); }} accessibilityLabel="내 정보로 돌아가기" />
        </View>
        <Text style={styles.headerTitle}>{activeTab === 'body' ? '신체정보 변경' : '개인정보 변경'}</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {activeTab === 'personal' ? <>
          <Text style={styles.sectionTitle}>계정 정보</Text>
          <PersonalInfoFields section="personal" spacious value={draft} onChange={next => { setDraft(next); setError(''); }} />
          <View style={styles.accountSection}>
            <View style={styles.phoneField}><Text style={styles.phoneLabel}>연락처</Text><TextInput accessibilityLabel="연락처" value={phone} onChangeText={value => setPhone(formatPhoneNumber(value))} placeholder="010-0000-0000" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" style={styles.phoneInput} maxLength={13} /></View>
            <View style={styles.phoneField}><Text style={styles.phoneLabel}>이메일</Text><TextInput accessibilityLabel="이메일" value={emailDraft} onChangeText={value => setEmailDraft(value)} placeholder="이메일 주소" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.phoneInput} /></View>
            <Text style={styles.passwordTitle}>비밀번호 변경</Text>
            <View style={styles.phoneField}><Text style={styles.phoneLabel}>현재 비밀번호</Text><View style={styles.passwordInputWrap}><TextInput accessibilityLabel="현재 비밀번호" value={currentPassword} onChangeText={setCurrentPassword} placeholder="현재 비밀번호를 입력해주세요." placeholderTextColor="#9CA3AF" secureTextEntry={!passwordVisibility.current} autoCapitalize="none" style={styles.passwordInput} /><Pressable accessibilityRole="button" accessibilityLabel={passwordVisibility.current ? '현재 비밀번호 숨기기' : '현재 비밀번호 보기'} onPress={() => setPasswordVisibility(value => ({ ...value, current: !value.current }))} hitSlop={10} style={styles.eyeButton}><Ionicons name={passwordVisibility.current ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6B7280" /></Pressable></View></View>
            <View style={styles.phoneField}><Text style={styles.phoneLabel}>새 비밀번호</Text><View style={styles.passwordInputWrap}><TextInput accessibilityLabel="새 비밀번호" value={newPassword} onChangeText={setNewPassword} placeholder="영문, 숫자, 특수문자 포함 8자 이상" placeholderTextColor="#9CA3AF" secureTextEntry={!passwordVisibility.next} autoCapitalize="none" style={styles.passwordInput} /><Pressable accessibilityRole="button" accessibilityLabel={passwordVisibility.next ? '새 비밀번호 숨기기' : '새 비밀번호 보기'} onPress={() => setPasswordVisibility(value => ({ ...value, next: !value.next }))} hitSlop={10} style={styles.eyeButton}><Ionicons name={passwordVisibility.next ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6B7280" /></Pressable></View></View>
            <View style={styles.phoneField}><Text style={styles.phoneLabel}>새 비밀번호 확인</Text><View style={styles.passwordInputWrap}><TextInput accessibilityLabel="새 비밀번호 확인" value={passwordConfirmation} onChangeText={setPasswordConfirmation} placeholder="새 비밀번호를 다시 입력해주세요." placeholderTextColor="#9CA3AF" secureTextEntry={!passwordVisibility.confirmation} autoCapitalize="none" style={styles.passwordInput} /><Pressable accessibilityRole="button" accessibilityLabel={passwordVisibility.confirmation ? '새 비밀번호 확인 숨기기' : '새 비밀번호 확인 보기'} onPress={() => setPasswordVisibility(value => ({ ...value, confirmation: !value.confirmation }))} hitSlop={10} style={styles.eyeButton}><Ionicons name={passwordVisibility.confirmation ? 'eye-off-outline' : 'eye-outline'} size={22} color="#6B7280" /></Pressable></View></View>
          </View>
        </> : <>
          <Text style={styles.sectionTitle}>신체정보</Text>
          <PersonalInfoFields section="body" spacious value={draft} onChange={next => { setDraft(next); setError(''); clearSaveError(); }} />
        </>}
        {error || saveError ? <Text accessibilityRole="alert" style={styles.error}>{error || saveError}</Text> : null}
        <Pressable onPress={() => void save()} disabled={saving} accessibilityRole="button" accessibilityState={{ busy: saving }} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>{saving ? '저장 중' : '수정 완료'}</Text>
        </Pressable>
      </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, color: '#111111' },
  headerSpacer: { width: 72 },
  saveButton: { minHeight: 52, marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  content: { flexGrow: 1, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 30 },
  sectionTitle: { color: '#111111', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  accountSection: { marginTop: 0 },
  passwordTitle: { color: '#111111', fontSize: 18, fontWeight: '600', marginTop: 24, marginBottom: 0 },
  phoneField: { marginTop: 24, gap: 8 },
  phoneLabel: { color: '#111111', fontSize: 16, lineHeight: 24 },
  phoneInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, color: '#111111', fontSize: 16 },
  passwordInputWrap: { position: 'relative', justifyContent: 'center' },
  passwordInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingLeft: 16, paddingRight: 50, paddingVertical: 14, color: '#111111', fontSize: 16 },
  eyeButton: { position: 'absolute', right: 14, minWidth: 30, minHeight: 40, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 },
});
