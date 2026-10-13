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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ───────────── 타입 / 공통 함수 ─────────────
// 화면 이동은 부모(App.tsx)가 정하도록 콜백으로 받음
type Props = {
  onPressSignup?: () => void;
};

// 아직 연결되지 않은 기능 버튼에서 공통으로 쓰는 안내 알림
function comingSoon(title: string) {
  Alert.alert(title, '현재는 화면 연습 단계입니다. 아직 연결되지 않았어요.');
}

// ───────────── 화면 ─────────────
export default function LoginScreen({ onPressSignup }: Props) {
  // ── 상태 ──
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);
  // 빈 문자열이면 오류 없음, 문구가 있으면 입력창 아래에 빨간 글씨로 표시
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // ── 로그인 처리 ──
  function onLogin() {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordOk = password.length > 0;

    // 둘 다 한 번에 표시 (피그마의 오류 화면처럼)
    setEmailError(emailOk ? '' : '이메일이 올바르지 않습니다.');
    setPasswordError(passwordOk ? '' : '비밀번호가 올바르지 않습니다.');
    if (!emailOk || !passwordOk) return;

    // TODO: 로그인 API 연결 (keepLogin 값도 함께 전달)
    // 서버에서 "계정 정보 불일치"가 오면 setEmailError / setPasswordError로 표시
    comingSoon('로그인');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ───────────── 로고 ───────────── */}
          <View style={styles.logoWrap}>
            {/* TODO: 로고 이미지가 준비되면 아래 View를 Image로 교체 */}
            <View style={styles.logoPlaceholder}>
              <Ionicons name="medkit-outline" size={34} color="#5B7FA6" />
            </View>
            <Text style={styles.logoText}>온약</Text>
            <Text style={styles.subtitle}>약물 상호작용 확인 서비스</Text>
          </View>

          {/* ───────────── 입력 폼 ───────────── */}
          <Text style={styles.label}>이메일</Text>
          <View style={[styles.inputBox, emailError ? styles.inputBoxError : null]}>
            <TextInput
              style={styles.input}
              value={email}
              // 다시 입력하기 시작하면 오류 문구 제거
              onChangeText={(v) => {
                setEmail(v);
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

          <Text style={[styles.label, { marginTop: 18 }]}>비밀번호</Text>
          <View style={[styles.inputBox, passwordError ? styles.inputBoxError : null]}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setPasswordError('');
              }}
              placeholder="비밀번호를 입력해주세요."
              placeholderTextColor="#B0B0B0"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {/* 눈 아이콘: 비밀번호 보기/숨기기 */}
            <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color="#8A8A8A"
              />
            </Pressable>
          </View>
          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

          {/* ───────────── 옵션 줄 (상태 유지 / 찾기) ───────────── */}
          <View style={styles.optionRow}>
            <Pressable
              style={styles.checkRow}
              onPress={() => setKeepLogin((v) => !v)}
              hitSlop={8}
            >
              <View style={[styles.checkbox, keepLogin && styles.checkboxOn]}>
                {keepLogin && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text style={styles.small}>로그인 상태 유지</Text>
            </Pressable>

            <View style={styles.findRow}>
              <Pressable onPress={() => comingSoon('아이디 찾기')} hitSlop={6}>
                <Text style={styles.underline}>아이디 찾기</Text>
              </Pressable>
              <Pressable onPress={() => comingSoon('비밀번호 찾기')} hitSlop={6}>
                <Text style={styles.underline}>비밀번호 찾기</Text>
              </Pressable>
            </View>
          </View>

          {/* ───────────── 로그인 버튼 ───────────── */}
          <Pressable style={styles.primaryBtn} onPress={onLogin}>
            <Text style={styles.primaryText}>로그인</Text>
          </Pressable>

          <Pressable style={styles.googleBtn} onPress={() => comingSoon('구글 로그인')}>
            <Ionicons name="logo-google" size={18} color="#DB4437" />
            <Text style={styles.googleText}>구글 계정으로 로그인</Text>
          </Pressable>

          {/* ───────────── 피보호자 로그인 ───────────── */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>피보호자 로그인</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.outlineBtn} onPress={() => comingSoon('연동 코드 로그인')}>
            <Text style={styles.outlineText}>연동 코드로 로그인</Text>
          </Pressable>
          <Pressable
            style={[styles.outlineBtn, { marginTop: 10 }]}
            onPress={() => comingSoon('QR 코드 로그인')}
          >
            <Text style={styles.outlineText}>QR 코드로 로그인</Text>
          </Pressable>

          {/* ───────────── 회원가입 링크 ───────────── */}
          <View style={styles.signupRow}>
            <Text style={styles.small}>계정이 없으신가요? </Text>
            <Pressable onPress={onPressSignup} hitSlop={6}>
              <Text style={styles.underline}>회원가입</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ───────────── 스타일 ─────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  body: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 32 },

  // 로고
  logoWrap: { alignItems: 'center', marginBottom: 40 },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 16, fontWeight: '700', color: '#5B7FA6', marginTop: 6 },
  subtitle: { fontSize: 13, color: '#555', marginTop: 20 },

  // 입력 폼
  label: { fontSize: 15, fontWeight: '500', color: '#000', marginBottom: 8 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  inputBoxError: { borderColor: '#E5484D' },
  input: { flex: 1, fontSize: 15, color: '#000', height: '100%' },
  error: { color: '#E5484D', fontSize: 11, marginTop: 6 },

  // 옵션 줄
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 18,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: '#000', borderColor: '#000' },
  findRow: { flexDirection: 'row', gap: 12 },
  small: { fontSize: 12, color: '#555' },
  underline: { fontSize: 12, color: '#000', textDecorationLine: 'underline' },

  // 로그인 버튼
  primaryBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  googleBtn: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  googleText: { fontSize: 15, color: '#000' },

  // 피보호자 로그인
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 24,
  },
  line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#D5D5D5' },
  dividerText: { fontSize: 11, color: '#8A8A8A' },
  outlineBtn: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  outlineText: { fontSize: 14, color: '#000' },

  // 회원가입 링크
  signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
});