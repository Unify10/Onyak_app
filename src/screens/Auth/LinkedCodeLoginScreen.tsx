import RoundBackButton from '../../components/Navigation/RoundBackButton';
import TextInput from '../../components/Typography/TextInput';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, Platform, Pressable, SafeAreaView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/Search/AppText/AppText';

// -----------------------------------------------------------------------------
// 화면 입력과 로그인 콜백 타입
// -----------------------------------------------------------------------------

type Props = {
  onPressBack?: () => void;
  onComplete?: () => void;
  onSubmitCode?: (
    code: string,
  ) => Promise<{ success: boolean; userName?: string }>;
};

// 연동 코드는 여섯 자리 숫자입니다.
const CODE_LENGTH = 6;
const ENABLE_TEST_LINKED_CODE_LOGIN = true; // 실제 연동 코드 인증 연결 후 false로 변경

// -----------------------------------------------------------------------------
// 연동 코드 로그인 화면
// -----------------------------------------------------------------------------

export default function LinkedCodeLoginScreen({
  onPressBack,
  onComplete,
  onSubmitCode,
}: Props) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  const { width } = useWindowDimensions();
  const desktopWeb = Platform.OS === 'web' && width >= 900;
  // TextInput ref에서 focus()만 사용합니다.
  const inputRef = useRef<{ focus: () => void } | null>(null);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'input' | 'success' | 'error'>('input');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 숫자만 입력받고 코드 길이를 제한합니다.
  function handleCodeChange(value: string) {
    const numbersOnly = value.replace(/\D/g, '').slice(0, CODE_LENGTH);

    setCode(numbersOnly);
    setStatus('input');
    setErrorMessage('');

    if (numbersOnly.length === CODE_LENGTH) {
      Keyboard.dismiss();
    }
  }

  // 서버 콜백으로 연동 코드 인증을 요청합니다.
  async function handleLogin() {
    if (code.length !== CODE_LENGTH || isLoading) return;

    Keyboard.dismiss();

  if (ENABLE_TEST_LINKED_CODE_LOGIN) {
    setUserName('테스트 사용자');
    setStatus('success');
    return;
  }

    if (!onSubmitCode) {
      setErrorMessage('올바르지 않은 연동 코드입니다.');
      setStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      const result = await onSubmitCode(code);

      if (result.success) {
        setUserName(result.userName ?? '사용자');
        setStatus('success');
      } else {
        setErrorMessage('올바르지 않은 연동 코드입니다.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('인증 중 문제가 발생했습니다. 다시 시도해주세요.');
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  }

  const isButtonEnabled =
    status === 'success' || code.length === CODE_LENGTH;

  // 화면 렌더링
  return (
    <SafeAreaView style={[styles.safe, desktopWeb && styles.desktopSafe]}>
      <View style={[styles.container, desktopWeb && styles.desktopContainer]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={Keyboard.dismiss}
          accessible={false}
        />

        <RoundBackButton
          style={[styles.backPosition, desktopWeb && styles.desktopBackPosition]}
          onPress={() => {
            Keyboard.dismiss();
            onPressBack?.();
          }}
          accessibilityLabel="로그인 화면으로 돌아가기"
        />

        {desktopWeb && (
          <View style={styles.desktopBrandHeader}>
            <Image source={require('../../../assets/onyak-logo.png')} style={styles.logoImage} resizeMode="contain" />
            <AppText style={styles.subtitle}>약물 상호작용 확인 서비스</AppText>
          </View>
        )}

        <View style={[styles.mainContent, desktopWeb && styles.desktopMainContent]}>
          <View style={[styles.introColumn, desktopWeb && styles.desktopIntroColumn]}>
            {!desktopWeb && (
              <View style={styles.brand}>
                <Image source={require('../../../assets/onyak-logo.png')} style={styles.logoImage} resizeMode="contain" />
                <AppText style={styles.subtitle}>약물 상호작용 확인 서비스</AppText>
              </View>
            )}
            <View style={[styles.illustration, desktopWeb && styles.desktopIllustration]}>
              <View style={styles.phone}>
                <Ionicons name="lock-closed" size={28} color="#4B5060" />
                {status === 'success' && <View style={[styles.resultBadge, styles.successBadge]}><AppText style={styles.resultBadgeText}>✓</AppText></View>}
                {status === 'error' && <View style={[styles.resultBadge, styles.errorBadge]}><AppText style={styles.resultBadgeText}>×</AppText></View>}
              </View>
            </View>
            <AppText style={[styles.title, desktopWeb && styles.desktopTitle]}>
              {status === 'success' ? `${userName}님의 가족이\n되신 걸 축하합니다!` : '보호자 계정에서 연동 코드를 확인해주세요.'}
            </AppText>
          </View>

          <View style={[styles.formColumn, desktopWeb && styles.desktopFormColumn]}>
            {status !== 'success' && (
              <View style={styles.codeSection}>
                <AppText style={styles.label}>연동 코드 입력</AppText>
                <Pressable style={styles.codeBoxes} onPress={() => inputRef.current?.focus()} accessibilityRole="button" accessibilityLabel="연동 코드 입력">
                  {Array.from({ length: CODE_LENGTH }, (_, index) => <View key={index} style={[styles.codeBox, index === code.length && styles.codeBoxFocused]}><AppText style={styles.codeDigit}>{code[index] ?? ''}</AppText></View>)}
                  <TextInput ref={instance => { inputRef.current = instance; }} value={code} onChangeText={handleCodeChange} keyboardType="number-pad" maxLength={CODE_LENGTH} caretHidden style={styles.hiddenInput} accessibilityLabel="6자리 연동 코드" />
                </Pressable>
                {status === 'error' && <AppText style={styles.message}>{errorMessage}</AppText>}
              </View>
            )}
            <View style={[styles.bottomArea, desktopWeb && styles.desktopBottomArea]}>
              <Pressable style={[styles.loginButton, isButtonEnabled ? styles.loginButtonEnabled : styles.loginButtonDisabled]} onPress={status === 'success' ? onComplete : handleLogin} disabled={!isButtonEnabled || isLoading} accessibilityRole="button">
                {isLoading ? <ActivityIndicator color="#FFFFFF" /> : <AppText style={styles.loginButtonText}>연동 로그인</AppText>}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 연동 코드 로그인 스타일
const baseStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  desktopSafe: { backgroundColor: '#FFFFFF', justifyContent: 'flex-start', padding: 0 },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  desktopContainer: { maxWidth: '100%', minHeight: undefined, maxHeight: undefined, alignSelf: 'stretch', paddingHorizontal: 48, paddingVertical: 24, borderRadius: 0, backgroundColor: '#FFFFFF', shadowOpacity: 0, elevation: 0 },
  backPosition: { marginTop: 8 },
  desktopBackPosition: { marginTop: 0, alignSelf: 'flex-start' },
  mainContent: { flex: 1 },
  desktopMainContent: { width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 64, paddingHorizontal: 40, paddingBottom: 16 },
  introColumn: {},
  desktopIntroColumn: { flex: 0.45, maxWidth: 340, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' },
  desktopBrandHeader: { width: '100%', alignSelf: 'center', alignItems: 'center', marginTop: 8, marginBottom: 16 },
  formColumn: { flex: 1 },
  desktopFormColumn: { flex: 1.55, maxWidth: 760, justifyContent: 'center' },
  desktopBottomArea: { marginTop: 36, marginBottom: 0, width: '100%', maxWidth: 520, alignSelf: 'center' },
  brand: {
    alignItems: 'center',
    marginTop: 14,
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  subtitle: {
    marginTop: 14,
    textAlign: 'center',
    color: '#8893A0',
    fontSize: 15,
  },
  desktopTitle: { alignSelf: 'center', width: '100%', textAlign: 'center', fontSize: 28, lineHeight: 38, marginTop: 20, maxWidth: 340 },
  illustration: {
    height: 118,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopIllustration: { width: '100%', alignItems: 'center', alignSelf: 'center' },
  phone: {
    width: 58,
    height: 82,
    borderWidth: 3,
    borderColor: '#4B5060',
    borderRadius: 12,
    backgroundColor: '#B8E8F4',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
  },
  resultBadge: {
    position: 'absolute',
    right: -7,
    bottom: -5,
    width: 29,
    height: 29,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    backgroundColor: '#12C76A',
  },
  errorBadge: {
    backgroundColor: '#F04444',
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  title: {
    minHeight: 60,
    marginTop: 26,
    color: '#444444',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  codeSection: {
    marginTop: 18,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  label: {
    marginBottom: 10,
    color: '#111111',
    fontSize: 20,
  },
  codeBoxes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    alignSelf: 'center',
  },
  codeBox: {
    height: 88,
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#DDE1E6',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxFocused: {
    borderColor: '#8EA5BC',
  },
  codeDigit: {
    color: '#222222',
    fontSize: 20,
    fontWeight: '600',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  message: {
    marginTop: 10,
    color: '#F04444',
    fontSize: 16,
  },
  bottomArea: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  loginButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonEnabled: {
    backgroundColor: '#000000',
  },
  loginButtonDisabled: {
    backgroundColor: '#888888',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
});

const compactStyles = StyleSheet.create({
  container: { paddingHorizontal: 18 },
  codeSection: { marginTop: 14 },
  codeBoxes: { gap: 7 },
  codeBox: { height: 58, borderRadius: 12 },
  illustration: { height: 100, marginTop: 12 },
});
