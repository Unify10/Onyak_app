import Text from '../../components/Typography/Text';
import TextInput from '../../components/Typography/TextInput';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useEffect, useRef, useState, type Ref } from 'react';
import { Animated, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, TextInput as NativeTextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { signup } from '../../api/auth';
import { useEmailVerification } from '../../hooks/useEmailVerification';
import { emptyPersonalInfo, isValidBirthDate, validatePersonalInfo } from '../../utils/personalInfo';

type Props = {
  onPressBack?: () => void;
  onComplete?: () => void;
};

type TextSelection = { start: number; end: number };

const LAST_INPUT_STEP = 3;

export default function SignupScreen({ onPressBack, onComplete }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const verification = useEmailVerification(email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupError, setSignupError] = useState('');
  const signupRequest = useRef<AbortController | null>(null);
  const passwordConfirmInput = useRef<NativeTextInput>(null);
  const phoneInput = useRef<NativeTextInput>(null);
  const [focusTarget, setFocusTarget] = useState<{ field: 'passwordConfirm' | 'phone'; revision: number } | null>(null);

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // 눈 아이콘을 눌렀을 때 커서 위치를 보존합니다.
  const [passwordSelection, setPasswordSelection] = useState<TextSelection>({
    start: 0,
    end: 0,
  });
  const [passwordConfirmSelection, setPasswordConfirmSelection] =
    useState<TextSelection>({ start: 0, end: 0 });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // 신체 정보는 모두 선택 입력이며, 비워 둔 채 다음 단계로 넘어갈 수 있습니다.
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [gender, setGender] = useState('');
  const [pregnancyStatus, setPregnancyStatus] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // 단계가 바뀔 때 입력 화면이 부드럽게 나타나도록 애니메이션 값을 둡니다.
  const [stepTransition] = useState(() => new Animated.Value(1));

  useEffect(() => {
    stepTransition.setValue(0);

    Animated.timing(stepTransition, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [step, stepTransition]);

  useEffect(() => () => signupRequest.current?.abort(), []);
  useEffect(() => {
    if (focusTarget?.field === 'passwordConfirm') passwordConfirmInput.current?.focus();
    if (focusTarget?.field === 'phone') phoneInput.current?.focus();
  }, [focusTarget]);
  const hasMinPasswordLength =
  password.length >= 8 && password.length <= 64 &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);
  const hasPasswordMatch =
    passwordConfirm.length > 0 && password === passwordConfirm;

  // 단계별 필수 입력을 확인해 다음 버튼 활성 상태를 정합니다.
  const canGoNext =
    step === 1
      ? verification.verified && !verification.pending &&
        hasMinPasswordLength &&
        hasPasswordMatch
      : step === 2
        ? name.trim().length > 0 && /^01[0-9][0-9]{7,8}$/.test(phone.replace(/\D/g, ''))
      : true;

  async function goToNextStep() {
    if (!canGoNext || signupRequest.current) return;
    if (step < LAST_INPUT_STEP) {
      setStep(current => current + 1);
      return;
    }
    if (step > LAST_INPUT_STEP) {
      onComplete?.();
      return;
    }
    if (birthDate && !isValidBirthDate(birthDate)) {
      setBirthDateError('생년월일을 YYYY-MM-DD 형식으로 입력해 주세요.');
      return;
    }

    const heightValue = height.trim().replace(',', '.');
    const weightValue = weight.trim().replace(',', '.');
    const bodyError = validatePersonalInfo({ ...emptyPersonalInfo, name, height: heightValue, weight: weightValue });
    if (bodyError) {
      setSignupError(bodyError);
      return;
    }

    const controller = new AbortController();
    signupRequest.current = controller;
    setIsSubmitting(true);
    setSignupError('');
    try {
      await signup({
        email: email.trim(),
        password,
        password_confirm: passwordConfirm,
        name: name.trim(),
        phone: phone.replace(/\D/g, ''),
        birth_date: birthDate || undefined,
        height: heightValue ? Number(heightValue) : undefined,
        weight: weightValue ? Number(weightValue) : undefined,
        gender: gender === '여성' ? 'F' : gender === '남성' ? 'M' : undefined,
        is_pregnant: gender === '남성' ? undefined
          : pregnancyStatus === '임신 중' ? true
          : pregnancyStatus === '해당 없음' ? false
          : undefined,
      }, controller.signal);
      if (!controller.signal.aborted) setStep(4);
    } catch (error) {
      if (!controller.signal.aborted) {
        setSignupError(error instanceof Error ? error.message : '회원가입에 실패했어요.');
      }
    } finally {
      signupRequest.current = null;
      if (!controller.signal.aborted) setIsSubmitting(false);
    }
  }

  function goToPreviousStep() {
    if (signupRequest.current) return;
    if (step > 1 && step <= LAST_INPUT_STEP) {
      setSignupError('');
      setStep(current => current - 1);
      return;
    }
    onPressBack?.();
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    verification.reset();
  }

  function handleBirthDateChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setBirthDate([digits.slice(0, 4), digits.slice(4, 6), digits.slice(6)].filter(Boolean).join('-'));
    setBirthDateError('');
  }

  // 전화번호에 하이픈을 자동으로 넣습니다.
  function formatPhoneNumber(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 11);

    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  }

  function renderField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    maxLength,
    inputRef,
    onSubmitEditing,
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric' | 'decimal-pad';
    maxLength?: number;
    inputRef?: Ref<NativeTextInput>;
    onSubmitEditing?: () => void;
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A8A8A8"
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={maxLength}
          returnKeyType="go"
          onSubmitEditing={onSubmitEditing ?? (() => void goToNextStep())}
        />
      </View>
    );
  }

  function renderPasswordField({
    label,
    value,
    onChangeText,
    placeholder,
    visible,
    onToggleVisible,
    selection,
    onSelectionChange,
    onSubmitEditing,
    inputRef,
    helperMessage,
    helperIsSuccess = false,
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    visible: boolean;
    onToggleVisible: () => void;
    selection: TextSelection;
    onSelectionChange: (selection: TextSelection) => void;
    onSubmitEditing?: () => void;
    inputRef?: Ref<NativeTextInput>;
    helperMessage?: string;
    helperIsSuccess?: boolean;
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.passwordInputRow}>
          <TextInput
            ref={inputRef}
            style={[styles.input, styles.passwordInput]}
            value={value}
            onChangeText={onChangeText}
            onSelectionChange={({ nativeEvent }) =>
              onSelectionChange(nativeEvent.selection)
            }
            selection={selection}
            placeholder={placeholder}
            placeholderTextColor="#A8A8A8"
            secureTextEntry={!visible}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={onSubmitEditing}
          />

          <Pressable
            style={styles.eyeButton}
            onPress={onToggleVisible}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
          >
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color="#858D98"
            />
          </Pressable>
        </View>

        {!!helperMessage && (
          <Text
            style={[
              styles.helperText,
              helperIsSuccess ? styles.successText : styles.errorText,
            ]}
          >
            {helperMessage}
          </Text>
        )}
      </View>
    );
  }

  function renderStep() {
    if (step === 1) {
      const verificationMessage = verification.message && (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.helperText, styles.verificationMessage, verification.message.error ? styles.errorText : styles.successText]}
        >
          {verification.message.text}
        </Text>
      );

      return (
        <>
          <Text style={styles.sectionTitle}>계정 정보</Text>

          <View style={styles.field}>
            <Text style={styles.label}>이메일</Text>
            <View style={styles.emailRow}>
              <TextInput
                style={[styles.input, styles.emailInput]}
                value={email}
                onChangeText={handleEmailChange}
                editable={!verification.pending}
                placeholder="이메일을 입력해주세요."
                placeholderTextColor="#A8A8A8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="go"
                onSubmitEditing={() => void verification.submit('send')}
              />
              <Pressable
                style={styles.verifyButton}
                onPress={() => void verification.submit('send')}
                disabled={Boolean(verification.pending)}
              >
                <Text style={styles.smallButtonText}>
                  {verification.pending === 'send' ? '발송 중' : verification.sent ? '재발송' : '인증번호 발송'}
                </Text>
              </Pressable>
            </View>
            {!verification.sent && verificationMessage}
          </View>

          {verification.sent && (
            <View style={[styles.field, verification.message && styles.verificationFieldWithMessage]}>
              <Text style={styles.label}>인증번호</Text>
              <View style={styles.codeRow}>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={verification.code}
                  onChangeText={verification.changeCode}
                  editable={!verification.pending}
                  placeholder="인증코드 입력"
                  placeholderTextColor="#A8A8A8"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  autoComplete="one-time-code"
                  returnKeyType="go"
                  onSubmitEditing={() => void verification.submit('verify')}
                />

                {/* 인증 완료 상태에서도 버튼 배경은 계속 흰색입니다. */}
                <Pressable
                  style={styles.verifyButton}
                  onPress={() => void verification.submit('verify')}
                  disabled={Boolean(verification.pending) || verification.verified}
                >
                  <Text style={styles.smallButtonText}>{verification.pending === 'verify' ? '확인 중' : '확인'}</Text>
                </Pressable>
              </View>
              {verificationMessage}
            </View>
          )}

          {renderPasswordField({
            label: '비밀번호',
            value: password,
            onChangeText: setPassword,
            placeholder: '영문, 숫자, 특수문자 포함 8자 이상',
            visible: showPassword,
            onToggleVisible: () =>
              setShowPassword((current) => !current),
            selection: passwordSelection,
            onSelectionChange: setPasswordSelection,
            onSubmitEditing: () => setFocusTarget(current => ({ field: 'passwordConfirm', revision: (current?.revision ?? 0) + 1 })),
            helperMessage:
              password.length > 0 && !hasMinPasswordLength
                ? '비밀번호는 영문, 숫자, 특수문자를 포함해 8~64자로 입력해 주세요.'
                : undefined,
          })}

          {renderPasswordField({
            label: '비밀번호 확인',
            value: passwordConfirm,
            onChangeText: setPasswordConfirm,
            placeholder: '비밀번호를 다시 한 번 입력해주세요.',
            visible: showPasswordConfirm,
            onToggleVisible: () =>
              setShowPasswordConfirm((current) => !current),
            selection: passwordConfirmSelection,
            onSelectionChange: setPasswordConfirmSelection,
            inputRef: passwordConfirmInput,
            onSubmitEditing: () => void goToNextStep(),
            helperMessage: passwordConfirm
              ? hasPasswordMatch
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 일치하지 않습니다.'
              : undefined,
            helperIsSuccess: hasPasswordMatch,
          })}
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <Text style={styles.sectionTitle}>계정 정보</Text>

          {renderField({
            label: '이름',
            value: name,
            onChangeText: setName,
            placeholder: '예시) 홍길동',
            onSubmitEditing: () => setFocusTarget(current => ({ field: 'phone', revision: (current?.revision ?? 0) + 1 })),
          })}

          {renderField({
            label: '전화번호',
            value: phone,
            onChangeText: (value) => setPhone(formatPhoneNumber(value)),
            placeholder: '전화번호를 입력해주세요.',
            keyboardType: 'phone-pad',
            maxLength: 13,
            inputRef: phoneInput,
          })}
        </>
      );
    }

    if (step === 3) {
      const pregnancyDisabled = gender === '남성';

      return (
        <>
          <Text style={styles.sectionTitle}>신체 정보 (선택)</Text>
          <Text style={styles.optionalDescription}>
            복용 주의사항 안내에 활용돼요. 입력하지 않아도 가입할 수 있습니다.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>생년월일</Text>
            <TextInput
              style={styles.input}
              value={birthDate}
              onChangeText={handleBirthDateChange}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#A8A8A8"
              keyboardType="number-pad"
              maxLength={10}
              returnKeyType="go"
              onSubmitEditing={() => void goToNextStep()}
            />
            {birthDateError ? <Text style={[styles.helperText, styles.errorText]}>{birthDateError}</Text> : null}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderRow}>
              {['여성', '남성', '선택 안 함'].map((item) => {
                const selected = gender === item;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.genderButton,
                      selected && styles.genderButtonSelected,
                    ]}
                    onPress={() => {
                      setGender(item);
                      if (item === '남성') setPregnancyStatus('');
                    }}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        selected && styles.genderTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, pregnancyDisabled && styles.pregnancyTextDisabled]}>임신 여부</Text>
            <View style={styles.genderRow}>
              {['임신 중', '해당 없음', '응답 안 함'].map((item) => {
                const selected = pregnancyStatus === item;

                return (
                  <Pressable
                    key={item}
                    style={[
                      styles.pregnancyButton,
                      selected && styles.genderButtonSelected,
                      pregnancyDisabled && styles.pregnancyButtonDisabled,
                    ]}
                    onPress={() => setPregnancyStatus(item)}
                    disabled={pregnancyDisabled}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: pregnancyDisabled, selected }}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        selected && styles.genderTextSelected,
                        pregnancyDisabled && styles.pregnancyTextDisabled,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {renderField({
            label: '신장 (cm)',
            value: height,
            onChangeText: value => {
              setHeight(value);
              setSignupError('');
            },
            placeholder: '예: 170.5',
            keyboardType: 'decimal-pad',
            maxLength: 6,
          })}

          {renderField({
            label: '몸무게 (kg)',
            value: weight,
            onChangeText: value => {
              setWeight(value);
              setSignupError('');
            },
            placeholder: '예: 65.5',
            keyboardType: 'decimal-pad',
            maxLength: 6,
          })}
        </>
      );
    }

    return (
      <View style={styles.complete}>
        <Text style={styles.partyEmoji}>🎉</Text>
        <Text style={styles.completeTitle}>
          회원가입이{'\n'}완료되었습니다.
        </Text>
      </View>
    );
  }

  const isCompleteStep = step === 4;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            style={styles.backButton}
            onPress={goToPreviousStep}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>회원가입</Text>
          <View style={styles.headerSpacer} />
        </View>

        {!isCompleteStep && (
          <View style={styles.progressRow}>
            {[1, 2, 3, 4].map((item) => (
              <View
                key={item}
                style={[
                  styles.progressSegment,
                  item <= step
                    ? styles.progressSegmentActive
                    : styles.progressSegmentInactive,
                  item === step && styles.progressSegmentCurrent,
                  item !== step && styles.progressSegmentShort,
                ]}
              />
            ))}
          </View>
        )}

        <Animated.View
          style={[
            styles.animatedContent,
            {
              opacity: stepTransition,
              transform: [
                {
                  translateY: stepTransition.interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.content,
              isCompleteStep && styles.completeContent,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {renderStep()}
          </ScrollView>
        </Animated.View>

        <View style={styles.bottomArea}>
          {signupError ? <Text accessibilityLiveRegion="polite" style={[styles.helperText, styles.errorText]}>{signupError}</Text> : null}
          <Pressable
            style={[
              styles.nextButton,
              canGoNext && !isSubmitting ? styles.nextButtonEnabled : styles.nextButtonDisabled,
            ]}
            onPress={() => void goToNextStep()}
            disabled={!canGoNext || isSubmitting}
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? '가입 중' : isCompleteStep
                ? '로그인으로 돌아가기'
                : step === 3 && !birthDate && !gender && !pregnancyStatus && !height && !weight
                  ? '건너뛰기'
                  : '다음'}
            </Text>
          </Pressable>

          {!isCompleteStep && (
            <Text style={styles.termsText} numberOfLines={1}>
              다음을 누르면 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ───────────── 화면 스타일 ─────────────
const baseStyles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoiding: { flex: 1 },
  header: {
    height: 64,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E7E7E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    marginTop: -4,
    color: '#111111',
    fontFamily: 'Pretendard',
    fontSize: 30,
    lineHeight: 34,
  },
  headerTitle: {
    color: '#111111',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSpacer: { width: 42 },
  progressRow: {
    height: 24,
    paddingHorizontal: 22,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  progressSegment: { height: 8, borderRadius: 5 },
  progressSegmentShort: { width: 38 },
  progressSegmentActive: { backgroundColor: '#000000' },
  progressSegmentInactive: { backgroundColor: '#E6E7EA' },
  progressSegmentCurrent: { flex: 1 },
  animatedContent: { flex: 1 },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 40,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 28,
    color: '#657080',
    fontFamily: 'Pretendard',
    fontSize: 18,
  },
  optionalDescription: {
    marginTop: -18,
    marginBottom: 22,
    color: '#858D98',
    fontFamily: 'Pretendard',
    fontSize: 15,
    lineHeight: 22,
  },
  field: { marginBottom: 12 },
  label: {
    marginBottom: 5,
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDE1E6',
    borderRadius: 12,
    justifyContent: 'center',
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
  },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emailInput: { flex: 1, minWidth: 0 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  codeInput: { flex: 1, minWidth: 0 },
  passwordInputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 52,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButton: {
    minHeight: 48,
    flexShrink: 0,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#D8DDE3',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 13,
    fontWeight: '500',
  },
  verificationFieldWithMessage: { marginBottom: 8 },
  verificationMessage: { marginTop: 8 },
  helperText: {
    marginTop: 2,
    fontFamily: 'Pretendard',
    fontSize: 13,
  },
  errorText: { color: '#E34B4B' },
  successText: { color: '#188A4B' },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: '#DDE1E6',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pregnancyButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#DDE1E6',
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  genderText: {
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 16,
  },
  genderTextSelected: { color: '#FFFFFF' },
  pregnancyButtonDisabled: {
    backgroundColor: '#F2F4F7',
    borderColor: '#E5E7EB',
  },
  pregnancyTextDisabled: { color: '#6B7280' },
  completeContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  complete: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingBottom: 12,
  },
  partyEmoji: { marginBottom: 56, fontSize: 150, textAlign: 'center' },
  completeTitle: {
    color: '#111111',
    fontFamily: 'Pretendard',
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 64,
  },
  bottomArea: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E7E7E7',
  },
  nextButton: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonEnabled: { backgroundColor: '#000000' },
  nextButtonDisabled: { backgroundColor: '#888888' },
  nextButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Pretendard',
    fontSize: 20,
    fontWeight: '600',
  },
  termsText: {
    marginTop: 6,
    color: '#8A9099',
    fontFamily: 'Pretendard',
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    includeFontPadding: false,
  },

    logoImage: {
    width: 64,
    height: 64,
  },
});
