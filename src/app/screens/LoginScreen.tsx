// ───────────── 불러오기 ─────────────
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// -----------------------------------------------------------------------------
// 로그인 화면 입력 콜백 타입
// -----------------------------------------------------------------------------
type Props = {
  onPressSignup?: () => void;
  onPressLinkedCode?: () => void;
  onPressQRLogin?: () => void;
  onPressFindPassword?: () => void;
  onLoginSuccess?: () => void;
};

// 아직 연결되지 않은 기능 버튼에서 공통으로 쓰는 안내 알림
function comingSoon(title: string) {
  Alert.alert(title, '현재는 화면 연습 단계입니다. 아직 연결되지 않았어요.');
}

// -----------------------------------------------------------------------------
// 로그인 화면
// -----------------------------------------------------------------------------
export default function LoginScreen({
  onPressSignup,
  onPressLinkedCode,
  onPressQRLogin,
  onPressFindPassword,
  onLoginSuccess,
}: Props) {
  // 입력값과 화면 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);

  // 오류 문구가 비어 있으면 입력 오류가 없는 상태입니다.
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 로그인 처리
  function onLogin() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordOk = password.length > 0;

    setEmailError(emailOk ? '' : '이메일이 올바르지 않습니다.');
    setPasswordError(passwordOk ? '' : '비밀번호가 올바르지 않습니다.');

    if (!emailOk || !passwordOk) return;

    // 데모 동작: 입력 형식만 확인한 뒤 메인 화면으로 이동합니다.
    // 실제 사용 전에는 서버 인증 성공 시점에 이 콜백을 호출해야 합니다.
    onLoginSuccess?.();
  }

  // 화면 렌더링: 로고, 입력란, 계정 메뉴 순서
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ───────────── 로고 ───────────── */}
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/onyak-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.subtitle}>약물 상호작용 확인 서비스</Text>
          </View>

          {/* ───────────── 이메일 입력 ───────────── */}
          <Text style={styles.label}>이메일</Text>
          <View
            style={[
              styles.inputBox,
              emailError ? styles.inputBoxError : null,
            ]}
          >
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setEmailError('');
              }}
              placeholder="이메일을 입력해주세요."
              placeholderTextColor="#B0B0B0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {/* ───────────── 비밀번호 입력 ───────────── */}
          <Text style={[styles.label, styles.passwordLabel]}>비밀번호</Text>
          <View
            style={[
              styles.inputBox,
              passwordError ? styles.inputBoxError : null,
            ]}
          >
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setPasswordError('');
              }}
              placeholder="비밀번호를 입력해주세요."
              placeholderTextColor="#B0B0B0"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* 눈 아이콘을 눌러 비밀번호 표시 여부를 바꿉니다. */}
            <Pressable
              onPress={() => setShowPassword((visible) => !visible)}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
              }
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#8A8A8A"
              />
            </Pressable>
          </View>
          {passwordError ? (
            <Text style={styles.error}>{passwordError}</Text>
          ) : null}

          {/* ───────────── 로그인 유지 / 비밀번호 찾기 ───────────── */}
          <View style={styles.optionRow}>
            <Pressable
              style={styles.checkRow}
              onPress={() => setKeepLogin((value) => !value)}
              hitSlop={8}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: keepLogin }}
            >
              <View style={[styles.checkbox, keepLogin && styles.checkboxOn]}>
                {keepLogin && (
                  <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.small}>로그인 상태 유지</Text>
            </Pressable>

            <Pressable
              onPress={onPressFindPassword}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="비밀번호 찾기"
            >
              <Text style={styles.underline}>비밀번호 찾기</Text>
            </Pressable>
          </View>

          {/* ───────────── 로그인 버튼 ───────────── */}
          <Pressable style={styles.primaryBtn} onPress={onLogin}>
            <Text style={styles.primaryText}>로그인</Text>
          </Pressable>

          {/* ───────────── 구글 로그인 ───────────── */}
          <Pressable
            style={styles.googleBtn}
            onPress={() => comingSoon('구글 로그인')}
          >
            <Image
              source={require('../../../assets/google-logo.png')}
              style={styles.googleLogo}
              resizeMode="contain"
            />
            <Text style={styles.googleText}>구글 계정으로 로그인</Text>
          </Pressable>

          {/* ───────────── 피보호자 로그인 ───────────── */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>피보호자 로그인</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.outlineBtn} onPress={onPressLinkedCode}>
            <Text style={styles.outlineText}>연동 코드로 로그인</Text>
          </Pressable>

          <Pressable
            style={[styles.outlineBtn, styles.qrButton]}
            onPress={() => onPressQRLogin?.()}
          >
            <Text style={styles.outlineText}>QR 코드로 로그인</Text>
          </Pressable>

          {/* ───────────── 회원가입 링크 ───────────── */}
          <View style={styles.signupRow}>
            <Text style={styles.small}>계정이 없으신가요? </Text>
            <Pressable
              onPress={onPressSignup}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel="회원가입 화면으로 이동"
            >
              <Text style={styles.underline}>회원가입</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ───────────── 스타일 ─────────────
// 로그인 화면 스타일
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 32,
  },

  // 로고
  logoWrap: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    marginTop: 6,
    color: '#5B7FA6',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 20,
    color: '#555555',
    fontSize: 13,
  },
  googleLogo: {
    width: 20,
    height: 20,
  },

  // 입력 폼
  label: {
    marginBottom: 8,
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
  },
  passwordLabel: {
    marginTop: 18,
  },
  inputBox: {
    height: 52,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  inputBoxError: {
    borderColor: '#E5484D',
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#000000',
    fontSize: 15,
  },
  error: {
    marginTop: 6,
    color: '#E5484D',
    fontSize: 11,
  },

  // 로그인 유지 / 비밀번호 찾기
  optionRow: {
    marginTop: 14,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  small: {
    color: '#555555',
    fontSize: 12,
  },
  underline: {
    color: '#000000',
    fontSize: 12,
    textDecorationLine: 'underline',
  },

  // 로그인 버튼
  primaryBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },

  // 구글 로그인 버튼
  googleBtn: {
    height: 52,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  googleText: {
    color: '#000000',
    fontSize: 15,
  },

  // 피보호자 로그인
  dividerRow: {
    marginVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D5D5D5',
  },
  dividerText: {
    color: '#8A8A8A',
    fontSize: 11,
  },
  outlineBtn: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrButton: {
    marginTop: 10,
  },
  outlineText: {
    color: '#000000',
    fontSize: 14,
  },

  // 회원가입 링크
  signupRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
  },

    logoImage: {
    width: 64,
    height: 64,
  },
});
