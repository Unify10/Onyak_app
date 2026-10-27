import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../MainScreens/AppText';

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
  // TextInput ref에서 focus()만 사용합니다.
  const inputRef = useRef<{ focus: () => void } | null>(null);

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'input' | 'success' | 'error'>('input');
  const [userName, setUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={Keyboard.dismiss}
          accessible={false}
        />

        <Pressable
          style={styles.backButton}
          onPress={() => {
            Keyboard.dismiss();
            onPressBack?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="로그인 화면으로 돌아가기"
        >
          <AppText style={styles.backButtonText}>‹</AppText>
        </Pressable>

        <View style={styles.brand}>
          <Image
            source={require('../../../assets/onyak-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <AppText style={styles.subtitle}>
            약물 상호작용 확인 서비스
          </AppText>
        </View>

        <View style={styles.illustration}>
          <View style={styles.phone}>
            <Ionicons name="lock-closed" size={28} color="#4B5060" />

            {status === 'success' && (
              <View style={[styles.resultBadge, styles.successBadge]}>
                <AppText style={styles.resultBadgeText}>✓</AppText>
              </View>
            )}

            {status === 'error' && (
              <View style={[styles.resultBadge, styles.errorBadge]}>
                <AppText style={styles.resultBadgeText}>×</AppText>
              </View>
            )}
          </View>
        </View>

        <AppText style={styles.title}>
          {status === 'success'
            ? `${userName}님의 가족이\n되신 걸 축하합니다!`
            : '보호자 계정에서 연동 코드를 확인해주세요.'}
        </AppText>

        {status !== 'success' && (
          <View style={styles.codeSection}>
            <AppText style={styles.label}>연동 코드 입력</AppText>

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
                  <AppText style={styles.codeDigit}>
                    {code[index] ?? ''}
                  </AppText>
                </View>
              ))}

              <TextInput
                ref={instance => {
                  inputRef.current = instance;
                }}
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
              <AppText style={styles.message}>{errorMessage}</AppText>
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
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText style={styles.loginButtonText}>
                연동 로그인
              </AppText>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
    width: 42,
    height: 42,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    marginTop: -4,
    color: '#333333',
    fontSize: 30,
    lineHeight: 34,
  },
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
    color: '#8893A0',
    fontSize: 15,
  },
  illustration: {
    height: 118,
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    marginHorizontal: 10,
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
    gap: 7,
  },
  codeBox: {
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