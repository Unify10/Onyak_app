import { useState } from 'react';
import {
  Alert,
  Keyboard,
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

type Props = {
  onPressBack?: () => void;
};

export default function FindAccountScreen({ onPressBack }: Props) {
  const [email, setEmail] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = isEmailValid;

  function handleSubmit() {
    if (!canSubmit) return;

    Keyboard.dismiss();

    // 실제 이메일 발송 기능은 서버 API 연결 후 사용할 수 있습니다.
    Alert.alert(
      '비밀번호 찾기',
      '비밀번호 재설정 안내 기능은 서버 API 연결 후 사용할 수 있습니다.',
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={onPressBack}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
          >
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>비밀번호 찾기</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            비밀번호 재설정 안내를 받을 이메일을 입력해주세요.
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="가입한 이메일을 입력해주세요."
              placeholderTextColor="#A8A8A8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          <Text style={styles.helpText}>
            입력한 이메일로 비밀번호 재설정 안내를 보냅니다.
          </Text>
        </ScrollView>

        <View style={styles.bottomArea}>
          <Pressable
            style={[
              styles.submitButton,
              canSubmit
                ? styles.submitButtonEnabled
                : styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={styles.submitButtonText}>재설정 안내 받기</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    borderRadius: 17,
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

  logoImage: {
    width: 64,
    height: 64,
  },
});