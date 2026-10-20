import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

type Props = {
  onPressBack?: () => void;
  onComplete?: () => void;
};

type PickerType = 'height' | 'weight' | null;
type TextSelection = { start: number; end: number };

const LAST_INPUT_STEP = 3;
const CODE_LENGTH = 6;
const HEIGHT_OPTIONS = Array.from({ length: 131 }, (_, index) => index + 100);
const WEIGHT_OPTIONS = Array.from({ length: 151 }, (_, index) => index + 30);

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function SignupScreen({ onPressBack, onComplete }: Props) {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

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

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activePicker, setActivePicker] = useState<PickerType>(null);

  // 단계가 바뀔 때 입력 화면이 부드럽게 나타나도록 애니메이션 값을 둡니다.
  const stepTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    stepTransition.setValue(0);

    Animated.timing(stepTransition, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [step, stepTransition]);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasMinPasswordLength =
  password.length >= 8 &&
  /[A-Za-z]/.test(password) &&
  /\d/.test(password) &&
  /[^A-Za-z0-9]/.test(password);
  const hasPasswordMatch =
    passwordConfirm.length > 0 && password === passwordConfirm;

  // 단계별 필수 입력을 확인해 다음 버튼 활성 상태를 정합니다.
  const canGoNext =
    step === 1
      ? isValidEmail &&
        isVerificationSent &&
        isEmailVerified &&
        hasMinPasswordLength &&
        hasPasswordMatch
      : step === 2
        ? name.trim().length > 0 && phone.replace(/\D/g, '').length >= 10
        : step === 3
          ? birthDate !== null &&
            gender.length > 0 &&
            height.length > 0 &&
            weight.length > 0
          : true;

  function goToNextStep() {
    if (!canGoNext) return;

    if (step < LAST_INPUT_STEP) {
      setStep((current) => current + 1);
    } else if (step === LAST_INPUT_STEP) {
      setStep(4);
    } else {
      onComplete?.();
    }
  }

  function goToPreviousStep() {
    if (activePicker) {
      setActivePicker(null);
      return;
    }

    if (showDatePicker) {
      setShowDatePicker(false);
      return;
    }

    if (step > 1 && step <= LAST_INPUT_STEP) {
      setStep((current) => current - 1);
      return;
    }

    onPressBack?.();
  }

  // 테스트용: 이메일 형식이 맞으면 인증번호 입력칸을 표시합니다.
  function sendVerificationCode() {
    if (!isValidEmail) {
      Alert.alert('이메일 확인', '올바른 이메일 주소를 먼저 입력해주세요.');
      return;
    }

    setIsVerificationSent(true);
    setIsEmailVerified(false);
    setVerificationCode('');
    setVerificationMessage('테스트용 입력창입니다. 실제 메일은 발송되지 않습니다.');
  }

  // 테스트용: 숫자 6자리를 입력하면 인증 완료로 표시합니다.
  function verifyVerificationCode() {
    if (verificationCode.length !== CODE_LENGTH) {
      setVerificationMessage('인증번호 6자리를 입력해주세요.');
      return;
    }

    setIsEmailVerified(true);
    setVerificationMessage('이메일 인증이 완료되었습니다.');
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setIsVerificationSent(false);
    setIsEmailVerified(false);
    setVerificationCode('');
    setVerificationMessage('');
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

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setBirthDate(selectedDate);
    }
  }

  function renderField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    maxLength,
  }: {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    maxLength?: number;
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A8A8A8"
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={maxLength}
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
    helperMessage?: string;
    helperIsSuccess?: boolean;
  }) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.passwordInputRow}>
          <TextInput
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

  function renderNumberPicker(
    type: Exclude<PickerType, null>,
    options: number[],
    selectedValue: string,
    unit: string,
  ) {
    return (
      <View style={styles.numberPicker}>
        <ScrollView
          style={styles.numberPickerList}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {options.map((value) => (
            <Pressable
              key={value}
              style={[
                styles.numberOption,
                selectedValue === String(value) && styles.numberOptionSelected,
              ]}
              onPress={() => {
                if (type === 'height') setHeight(String(value));
                else setWeight(String(value));

                setActivePicker(null);
              }}
            >
              <Text style={styles.numberOptionText}>
                {value} {unit}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  function renderStep() {
    if (step === 1) {
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
                placeholder="이메일을 입력해주세요."
                placeholderTextColor="#A8A8A8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                style={styles.verifyButton}
                onPress={sendVerificationCode}
              >
                <Text style={styles.smallButtonText}>
                  {isVerificationSent ? '재발송' : '인증번호 발송'}
                </Text>
              </Pressable>
            </View>
          </View>

          {isVerificationSent && (
            <View style={styles.field}>
              <Text style={styles.label}>인증번호</Text>
              <View style={styles.codeRow}>
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  value={verificationCode}
                  onChangeText={(value) => {
                    setVerificationCode(
                      value.replace(/\D/g, '').slice(0, CODE_LENGTH),
                    );
                    setIsEmailVerified(false);
                    setVerificationMessage('');
                  }}
                  placeholder="인증번호 입력"
                  placeholderTextColor="#A8A8A8"
                  keyboardType="number-pad"
                  maxLength={CODE_LENGTH}
                />

                {/* 인증 완료 상태에서도 버튼 배경은 계속 흰색입니다. */}
                <Pressable
                  style={styles.verifyButton}
                  onPress={verifyVerificationCode}
                >
                  <Text style={styles.smallButtonText}>확인</Text>
                </Pressable>
              </View>

              {!!verificationMessage && (
                <Text
                  style={[
                    styles.helperText,
                    isEmailVerified ? styles.successText : styles.errorText,
                  ]}
                >
                  {verificationMessage}
                </Text>
              )}
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
            helperMessage:
              password.length > 0 && !hasMinPasswordLength
                ? '비밀번호는 영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.'
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
          })}

          {renderField({
            label: '전화번호',
            value: phone,
            onChangeText: (value) => setPhone(formatPhoneNumber(value)),
            placeholder: '전화번호를 입력해주세요.',
            keyboardType: 'phone-pad',
            maxLength: 13,
          })}
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <Text style={styles.sectionTitle}>신체 정보</Text>

          <View style={styles.field}>
            <Text style={styles.label}>생년월일</Text>
            <Pressable
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.inputText, !birthDate && styles.placeholder]}>
                {birthDate ? formatDate(birthDate) : '예시) 2010-01-11'}
              </Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={birthDate ?? new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={handleDateChange}
                locale="ko-KR"
              />

              {Platform.OS === 'ios' && (
                <Pressable
                  style={styles.pickerDoneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.pickerDoneText}>선택 완료</Text>
                </Pressable>
              )}
            </View>
          )}

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
                    onPress={() => setGender(item)}
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
            <Text style={styles.label}>신장 (cm)</Text>
            <Pressable
              style={styles.input}
              onPress={() => setActivePicker('height')}
            >
              <Text style={[styles.inputText, !height && styles.placeholder]}>
                {height ? `${height} cm` : '선택해주세요.'}
              </Text>
            </Pressable>
            {activePicker === 'height' &&
              renderNumberPicker('height', HEIGHT_OPTIONS, height, 'cm')}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>몸무게 (kg)</Text>
            <Pressable
              style={styles.input}
              onPress={() => setActivePicker('weight')}
            >
              <Text style={[styles.inputText, !weight && styles.placeholder]}>
                {weight ? `${weight} kg` : '선택해주세요.'}
              </Text>
            </Pressable>
            {activePicker === 'weight' &&
              renderNumberPicker('weight', WEIGHT_OPTIONS, weight, 'kg')}
          </View>
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
          <Pressable style={styles.backButton} onPress={goToPreviousStep}>
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
          <Pressable
            style={[
              styles.nextButton,
              canGoNext ? styles.nextButtonEnabled : styles.nextButtonDisabled,
            ]}
            onPress={goToNextStep}
            disabled={!canGoNext}
          >
            <Text style={styles.nextButtonText}>
              {isCompleteStep ? '로그인으로 돌아가기' : '다음'}
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
const styles = StyleSheet.create({
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
    borderRadius: 21,
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
  inputText: {
    color: '#222222',
    fontFamily: 'Pretendard',
    fontSize: 20,
  },
  placeholder: { color: '#A8A8A8' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  emailInput: { flex: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  codeInput: { flex: 1 },
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
    height: 48,
    paddingHorizontal: 10,
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
    fontSize: 14,
    fontWeight: '500',
  },
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
  datePickerContainer: {
    marginTop: 6,
    marginBottom: 12,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
  },
  numberPicker: {
    marginTop: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  numberPickerList: { height: 160 },
  numberOption: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberOptionSelected: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  numberOptionText: {
    color: '#555555',
    fontFamily: 'Pretendard',
    fontSize: 18,
  },
  pickerDoneButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerDoneText: {
    color: '#111111',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontWeight: '600',
  },
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