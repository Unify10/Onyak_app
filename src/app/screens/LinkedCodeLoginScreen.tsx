import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';

type Props = {
  onPressBack?: () => void;
  onComplete?: () => void;
  onSubmitCode?: (
    code: string,
  ) => Promise<{ success: boolean; userName?: string }>;
};

const CODE_LENGTH = 6;

export default function LinkedCodeLoginScreen({
  onPressBack,
  onComplete,
  onSubmitCode,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'input' | 'success' | 'error'>('input');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 숫자만 입력받고, 6자리를 채우면 키보드를 닫습니다.
  function handleCodeChange(value: string) {
    const numbersOnly = value.replace(/\D/g, '').slice(0, CODE_LENGTH);

    setCode(numbersOnly);
    setStatus('input');
    setErrorMessage('');

    if (numbersOnly.length === CODE_LENGTH) {
      Keyboard.dismiss();
    }
  }

  async function handleLogin() {
    if (code.length !== CODE_LENGTH || isLoading) return;

    Keyboard.dismiss();

    // 서버 인증 함수가 연결되지 않은 경우 안내 문구를 표시합니다.
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 화면 빈 곳을 누르면 키보드를 닫습니다. */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={Keyboard.dismiss}
          accessible={false}
        />

        {/* 로그인 화면으로 돌아가기 */}
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Keyboard.dismiss();
            onPressBack?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="로그인 화면으로 돌아가기"
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        {/* 서비스 로고와 설명 */}
        <View style={styles.brand}>
          <Image
            source={require('../../../assets/onyak-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>약물 상호작용 확인 서비스</Text>
        </View>

        {/* 연동 상태를 아이콘으로 표시합니다. */}
        <View style={styles.illustration}>
          <View style={styles.phone}>
            <Text style={styles.lockIcon}>🔒</Text>

            {status === 'success' && (
              <View style={[styles.resultBadge, styles.successBadge]}>
                <Text style={styles.resultBadgeText}>✓</Text>
              </View>
            )}

            {status === 'error' && (
              <View style={[styles.resultBadge, styles.errorBadge]}>
                <Text style={styles.resultBadgeText}>×</Text>
              </View>
            )}
          </View>
        </View>

        {/* 인증 결과에 따라 안내 문구를 표시합니다. */}
        <Text style={styles.title}>
          {status === 'success'
            ? `${userName}님의 가족이\n되신 걸 축하합니다!`
            : '보호자 계정에서 연동 코드를 확인해주세요.'}
        </Text>

        {status !== 'success' && (
          <View style={styles.codeSection}>
            <Text style={styles.label}>연동 코드 입력</Text>

            {/* 칸을 누르면 숨겨진 입력창에 포커스됩니다. */}
            <Pressable
              style={styles.codeBoxes}
              onPress={() => inputRef.current?.focus()}
              accessibilityRole="button"
              accessibilityLabel="연동 코드 입력"
            >
              {Array.from({ length: CODE_LENGTH }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.codeBox,
                    index === code.length && styles.codeBoxFocused,
                  ]}
                >
                  <Text style={styles.codeDigit}>{code[index] ?? ''}</Text>
                </View>
              ))}

              <TextInput
                ref={inputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                maxLength={CODE_LENGTH}
                caretHidden
                style={styles.hiddenInput}
                accessibilityLabel="6자리 연동 코드"
              />
            </Pressable>

            {status === 'error' && (
              <Text style={styles.message}>{errorMessage}</Text>
            )}
          </View>
        )}

        <View style={styles.bottomArea}>
          <Pressable
            style={[
              styles.loginButton,
              isButtonEnabled
                ? styles.loginButtonEnabled
                : styles.loginButtonDisabled,
            ]}
            onPress={status === 'success' ? onComplete : handleLogin}
            disabled={!isButtonEnabled || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>연동 로그인</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ───────────── 화면 스타일 ─────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 17,
  },
  backButton: {
    width: 32,
    height: 32,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    marginTop: -3,
    color: '#333333',
    fontSize: 25,
    lineHeight: 28,
  },
  brand: {
    alignItems: 'center',
    marginTop: 14,
  },
  logoMark: {
    color: '#6686A5',
    fontSize: 27,
    fontWeight: '700',
  },
  logoName: {
    marginTop: -5,
    color: '#6686A5',
    fontSize: 11,
  },
  subtitle: {
    marginTop: 14,
    color: '#8893A0',
    fontSize: 11,
  },
  illustration: {
    height: 118,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    width: 48,
    height: 78,
    borderWidth: 3,
    borderColor: '#4B5060',
    borderRadius: 10,
    backgroundColor: '#B8E8F4',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
  },
  lockIcon: {
    fontSize: 27,
  },
  resultBadge: {
    position: 'absolute',
    right: -7,
    bottom: -5,
    width: 27,
    height: 27,
    borderRadius: 14,
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
    lineHeight: 25,
  },
  title: {
    minHeight: 60,
    marginTop: 26,
    color: '#444444',
    fontFamily: 'Pretendard',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    textAlign: 'center',
  },
  codeSection: {
    marginTop: 18,
    marginHorizontal: 10,
  },
  label: {
    marginBottom: 10,
    color: '#111111',
    fontFamily: 'Pretendard',
    fontSize: 18,
  },
  codeBoxes: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 7,
  },
  codeBox: {
    width: 0,
    height: 58,
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
    fontFamily: 'Pretendard',
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
    fontFamily: 'Pretendard',
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
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
  },

    logoImage: {
    width: 64,
    height: 64,
  },
});