import Text from '../../components/Typography/Text';
import TextInput from '../../components/Typography/TextInput';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswordScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const valid = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  const canSubmit = !!currentPassword && valid && confirmation === password && password !== currentPassword;
  function submit() {
    if (!canSubmit) return;
    setCurrentPassword(''); setPassword(''); setConfirmation('');
    setMessage('입력 형식을 확인했습니다. 실제 비밀번호 변경은 계정 연결 후 사용할 수 있습니다.');
  }
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" style={styles.header}><Ionicons name="chevron-back" size={22} /><Text style={styles.headerTitle}>비밀번호 변경</Text></Pressable>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.notice}><Ionicons name="shield-half" size={22} /><Text style={styles.noticeText}>안전한 계정 유지를 위해{ '\n' }비밀번호를 주기적으로 변경해주세요.</Text></View>
        <PasswordField label="비밀번호" value={currentPassword} onChange={setCurrentPassword} placeholder="현재 비밀번호를 입력해주세요." />
        <PasswordField label="새로운 비밀번호" value={password} onChange={setPassword} placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
        {!!password && !valid && <Text style={styles.error}>비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.</Text>}
        {!!password && password === currentPassword && <Text style={styles.error}>현재 비밀번호와 다른 비밀번호를 입력해주세요.</Text>}
        <PasswordField label="비밀번호 확인" value={confirmation} onChange={setConfirmation} placeholder="비밀번호를 한 번 더 입력해주세요." />
        {!!confirmation && confirmation !== password && <Text style={styles.error}>비밀번호가 일치하지 않습니다.</Text>}
        {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
      </ScrollView>
      <View style={styles.footer}><Pressable accessibilityRole="button" disabled={!canSubmit} onPress={submit} style={[styles.button, !canSubmit && styles.disabled]}><Text style={styles.buttonText}>비밀번호 변경하기</Text></Pressable></View>
    </KeyboardAvoidingView>
  );
}
function PasswordField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  const styles = useResponsiveStyles(baseStyles);
  const [visible, setVisible] = useState(false);
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.inputRow}><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#9CA3AF" secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} style={styles.input} /><Pressable accessibilityRole="button" accessibilityLabel={`${label} ${visible ? '숨기기' : '보기'}`} onPress={() => setVisible(current => !current)} style={styles.eye}><Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={22} color="#9CA3AF" /></Pressable></View></View>;
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, flexDirection: 'row', gap: 6, alignItems: 'center', paddingHorizontal: 20 },
  headerTitle: { color: '#111111', fontSize: 16 },
  content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 24 },
  notice: { backgroundColor: '#F5F5F7', borderRadius: 12, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 26 },
  noticeText: { flex: 1, color: '#4B5563', fontSize: 14, lineHeight: 22 },
  field: { marginTop: 18, gap: 8 }, label: { color: '#111111', fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, minHeight: 50 },
  input: { flex: 1, minWidth: 0, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14, color: '#111111' },
  eye: { minWidth: 44, minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  error: { fontSize: 12, lineHeight: 18, color: '#D92D20', marginTop: 6 },
  message: { color: '#4B5563', fontSize: 14, lineHeight: 22, marginTop: 24 },
  footer: { width: '100%', alignSelf: 'center', padding: 20 },
  button: { backgroundColor: '#000000', borderRadius: 12, minHeight: 50, justifyContent: 'center', alignItems: 'center' },
  disabled: { backgroundColor: '#9B9B9B' }, buttonText: { color: '#FFFFFF', fontSize: 16 },
});
