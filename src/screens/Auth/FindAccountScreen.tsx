import type { ComponentProps } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import Text from '../../components/Typography/Text';
import TextInput from '../../components/Typography/TextInput';
import { usePasswordReset } from '../../hooks/usePasswordReset';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';

type Props = { onPressBack: () => void };

const steps = {
  email: { title: '가입한 이메일을 입력해 주세요.', action: '인증코드 받기' },
  code: { title: '이메일로 받은 인증코드를 입력해 주세요.', action: '인증코드 확인' },
  password: { title: '새 비밀번호를 입력해 주세요.', action: '비밀번호 재설정' },
  done: { title: '비밀번호를 재설정했어요.', action: '로그인으로 돌아가기' },
};

export default function FindAccountScreen({ onPressBack }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const form = usePasswordReset();
  const { title, action } = steps[form.step];
  const canSubmit = !form.busy && (form.canSubmit || form.step === 'done');

  function handleSubmit() {
    if (!canSubmit) return;
    Keyboard.dismiss();
    if (form.step === 'done') onPressBack();
    else void form.submit();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onPressBack} accessibilityRole="button" accessibilityLabel="뒤로 가기">
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>비밀번호 찾기</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <Text style={styles.title}>{title}</Text>
          {form.step === 'email' && (
            <ResetField label="이메일" value={form.email} onChangeText={form.changeEmail} editable={!form.busy}
              placeholder="가입한 이메일을 입력해 주세요." keyboardType="email-address" autoComplete="email" onSubmitEditing={handleSubmit} />
          )}
          {form.step === 'code' && (
            <>
              <Text style={styles.helpText}>{form.email.trim()}</Text>
              <ResetField label="인증코드" value={form.code} onChangeText={form.changeCode} editable={!form.busy}
                placeholder="영문·숫자 6자리" autoComplete="one-time-code" autoCapitalize="characters" onSubmitEditing={handleSubmit} />
              <Pressable style={styles.link} accessibilityRole="button" disabled={form.busy} onPress={() => void form.resend()}>
                <Text style={styles.linkText}>인증코드 다시 받기</Text>
              </Pressable>
              <Pressable style={styles.link} accessibilityRole="button" disabled={form.busy} onPress={form.restart}>
                <Text style={styles.linkText}>이메일 변경</Text>
              </Pressable>
            </>
          )}
          {form.step === 'password' && (
            <>
              <ResetField label="새 비밀번호" value={form.password} onChangeText={form.changePassword} editable={!form.busy}
                placeholder="8~64자" secureTextEntry autoComplete="new-password" maxLength={64} onSubmitEditing={handleSubmit} />
              <ResetField label="새 비밀번호 확인" value={form.passwordConfirm} onChangeText={form.changePasswordConfirm}
                editable={!form.busy} secureTextEntry autoComplete="new-password" maxLength={64} onSubmitEditing={handleSubmit} />
              {form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm && (
                <Text style={[styles.message, styles.error]}>새 비밀번호가 일치하지 않아요.</Text>
              )}
            </>
          )}
          {form.message && (
            <Text accessibilityLiveRegion="polite" style={[styles.message, form.message.error && styles.error]}>
              {form.message.text}
            </Text>
          )}
        </ScrollView>

        <View style={styles.bottomArea}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: form.busy, disabled: !canSubmit }}
            style={[styles.submitButton, canSubmit ? styles.submitButtonEnabled : styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>{form.busy ? '처리 중…' : action}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ResetField({ label, ...props }: ComponentProps<typeof TextInput> & { label: string }) {
  const styles = useResponsiveStyles(baseStyles);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        accessibilityLabel={label}
        placeholderTextColor="#A8A8A8"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
      />
    </View>
  );
}

const baseStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    marginTop: -3,
    color: '#333333',
    fontFamily: 'Pretendard',
    fontSize: 25,
    lineHeight: 28,
  },
  headerTitle: {
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 34,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  title: {
    marginBottom: 28,
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    color: '#333333',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    height: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
  },
  helpText: {
    color: '#888888',
    fontFamily: 'Pretendard',
    fontSize: 13,
    lineHeight: 18,
  },
  bottomArea: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonEnabled: {
    backgroundColor: '#000000',
  },
  submitButtonDisabled: {
    backgroundColor: '#999999',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
  },

  link: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
  linkText: { color: '#222222', fontSize: 15, textDecorationLine: 'underline' },
  message: { marginTop: 8, color: '#525252', fontSize: 14, lineHeight: 20 },
  error: { color: '#B42318' },
});
