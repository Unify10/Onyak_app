import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { useProfile } from '../../providers/ProfileProvider';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import { validatePersonalInfo } from '../../utils/personalInfo';
import TextInput from '../../components/Typography/TextInput';

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
  const { profile, saveProfile } = useProfile();
  const { displayName, email, contactNumber, updateDisplayName, updateContactNumber, updateEmail, updatePassword } = useAuth();
  const [draft, setDraft] = useState(() => ({ ...profile, name: displayName }));
  const [phone, setPhone] = useState(contactNumber);
  const [emailDraft, setEmailDraft] = useState(email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  function save() {
    let message = validatePersonalInfo(draft);
    if (!message && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDraft.trim())) message = '올바른 이메일 주소를 입력해주세요.';
    const phoneDigits = phone.replace(/\D/g, '');
    if (!message && phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 11)) message = '연락처를 10~11자리로 입력해주세요.';
    const changingPassword = !!(currentPassword || newPassword || passwordConfirmation);
    if (!message && changingPassword && !currentPassword) message = '현재 비밀번호를 입력해주세요.';
    if (!message && changingPassword && !(newPassword.length >= 8 && /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword))) message = '새 비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.';
    if (!message && changingPassword && newPassword === currentPassword) message = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
    if (!message && changingPassword && newPassword !== passwordConfirmation) message = '새 비밀번호가 일치하지 않습니다.';
    setError(message);
    if (message) return;
    saveProfile({ ...draft, name: draft.name.trim() });
    updateDisplayName(draft.name.trim());
    updateContactNumber(formatPhoneNumber(phone));
    updateEmail(emailDraft.trim());
    if (changingPassword) updatePassword(newPassword);
    router.replace('/my-info');
  }
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}><Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" style={styles.headerButton}><Text>뒤로가기</Text></Pressable><Text style={styles.headerTitle}>개인정보 변경</Text><View style={styles.headerSpacer} /></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>프로필 정보</Text>
        <PersonalInfoFields showAge value={draft} onChange={next => { setDraft(next); setError(''); }} />
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>계정 정보</Text>
          <View style={styles.phoneField}><Text style={styles.phoneLabel}>연락처</Text><TextInput accessibilityLabel="연락처" value={phone} onChangeText={value => setPhone(formatPhoneNumber(value))} placeholder="010-0000-0000" placeholderTextColor="#9CA3AF" keyboardType="phone-pad" style={styles.phoneInput} maxLength={13} /></View>
          <View style={styles.phoneField}><Text style={styles.phoneLabel}>이메일</Text><TextInput accessibilityLabel="이메일" value={emailDraft} onChangeText={value => setEmailDraft(value)} placeholder="이메일 주소" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} style={styles.phoneInput} /></View>
          <Text style={styles.sectionTitle}>비밀번호 변경</Text>
          <View style={styles.phoneField}><Text style={styles.phoneLabel}>현재 비밀번호</Text><TextInput accessibilityLabel="현재 비밀번호" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry autoCapitalize="none" style={styles.phoneInput} /></View>
          <View style={styles.phoneField}><Text style={styles.phoneLabel}>새 비밀번호</Text><TextInput accessibilityLabel="새 비밀번호" value={newPassword} onChangeText={setNewPassword} placeholder="영문, 숫자, 특수문자 포함 8자 이상" placeholderTextColor="#9CA3AF" secureTextEntry autoCapitalize="none" style={styles.phoneInput} /></View>
          <View style={styles.phoneField}><Text style={styles.phoneLabel}>새 비밀번호 확인</Text><TextInput accessibilityLabel="새 비밀번호 확인" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry autoCapitalize="none" style={styles.phoneInput} /></View>
        </View>
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <Pressable onPress={save} accessibilityRole="button" style={styles.saveButton}><Text style={styles.saveButtonText}>수정 완료</Text></Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { width: 72, minHeight: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 18, color: '#111111' },
  headerSpacer: { width: 72 },
  saveButton: { minHeight: 52, marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  sectionTitle: { color: '#111111', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  accountSection: { marginTop: 32, paddingTop: 24, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  phoneField: { marginTop: 22, gap: 8 },
  phoneLabel: { color: '#111111', fontSize: 16, lineHeight: 24 },
  phoneInput: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50, paddingHorizontal: 16, paddingVertical: 14, color: '#111111', fontSize: 16 },
  error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 },
});
