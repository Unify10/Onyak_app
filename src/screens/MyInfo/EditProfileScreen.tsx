import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import QueryError from '../../components/Feedback/QueryError';
import RoundBackButton from '../../components/Navigation/RoundBackButton';
import { AccountPasswordField, AccountTextField } from '../../components/MyInfo/AccountCredentialFields';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import Text from '../../components/Typography/Text';
import { useAccountProfile } from '../../hooks/useAccountProfile';
import { useSaveAccountProfile } from '../../hooks/useSaveAccountProfile';
import { useSaveBodyProfile } from '../../hooks/useSaveBodyProfile';
import { useAuth } from '../../providers/AuthProvider';
import { formatPhoneNumber, validatePasswordChange } from '../../utils/accountCredentials';
import { calculateAge, validatePersonalInfo, type PersonalInfo } from '../../utils/personalInfo';

export default function EditProfileScreen() {
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const { isAuthenticated, email, contactNumber } = useAuth();
  const { state, retry } = useAccountProfile(isAuthenticated);
  const body = tab === 'body';
  const title = body ? '신체 정보 변경' : '개인정보 변경';

  if (state.status === 'ready') {
    return body
      ? <BodyProfileForm key={title} profile={state.profile} />
      : <AccountProfileForm key={title} profile={state.profile} email={email} phone={contactNumber} />;
  }

  return (
    <ProfileEditLayout title={title}>
      {state.status === 'error' ? <QueryError message={state.message} onRetry={retry} /> : <ListSkeleton label="내 정보 불러오는 중" />}
    </ProfileEditLayout>
  );
}

function AccountProfileForm({ profile, email, phone }: { profile: PersonalInfo; email: string; phone: string }) {
  const [phoneDraft, setPhoneDraft] = useState(() => formatPhoneNumber(phone));
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [validation, setValidation] = useState('');
  const { saveAccount, busy, error } = useSaveAccountProfile();

  async function save() {
    const changingPassword = Boolean(currentPassword || password || confirmation);
    const changedPhone = phoneDraft.replace(/\D/g, '') !== phone.replace(/\D/g, '');
    const message = changedPhone && !/^01\d-?\d{3,4}-?\d{4}$/.test(phoneDraft)
      ? '사용 중인 휴대폰 번호를 10~11자리로 입력해 주세요.'
      : changingPassword ? validatePasswordChange(currentPassword, password, confirmation) : '';
    setValidation(message);
    if (message || busy) return;

    if (!changedPhone && !changingPassword) {
      router.replace('/my-info');
      return;
    }
    const saved = await saveAccount({
      phone: changedPhone ? phoneDraft : undefined,
      password: changingPassword ? password : undefined,
      current_password: changingPassword ? currentPassword : undefined,
    });
    if (saved && !changingPassword) router.replace('/my-info');
    if (saved && changingPassword) router.replace('/login');
  }

  return (
    <ProfileEditLayout title="개인정보 변경" saving={busy}>
      <Text style={styles.sectionTitle}>계정 정보</Text>
      <AccountTextField label="이름" value={profile.name} />
      <AccountTextField label="이메일" value={email} />
      <AccountTextField label="연락처" value={phoneDraft} onChange={value => { setPhoneDraft(formatPhoneNumber(value)); setValidation(''); }} />
      <Text style={[styles.sectionTitle, styles.passwordTitle]}>비밀번호 변경</Text>
      <Text style={styles.note}>비밀번호를 변경하면 다시 로그인해야 해요.</Text>
      <AccountPasswordField label="현재 비밀번호" value={currentPassword} onChange={setCurrentPassword} placeholder="현재 비밀번호를 입력해 주세요." />
      <AccountPasswordField label="새 비밀번호" value={password} onChange={setPassword} placeholder="영문, 숫자, 특수문자 포함 8자 이상" />
      <AccountPasswordField label="새 비밀번호 확인" value={confirmation} onChange={setConfirmation} placeholder="새 비밀번호를 다시 입력해 주세요." />
      <SaveProfileButton saving={busy} error={validation || error} onSave={() => void save()} />
    </ProfileEditLayout>
  );
}

function BodyProfileForm({ profile }: { profile: PersonalInfo }) {
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState('');
  const { saveBody, saving, saveError, clearSaveError } = useSaveBodyProfile();

  async function save() {
    if (saving) return;
    clearSaveError();
    const value = {
      ...draft,
      age: calculateAge(draft.birthDate),
      height: draft.height.trim().replace(',', '.'),
      weight: draft.weight.trim().replace(',', '.'),
    };
    const message = validatePersonalInfo(value)
      || (Number(value.weight) > 300 ? '몸무게를 300kg 이하로 입력해 주세요.' : '');
    setError(message);
    if (!message && await saveBody(value)) router.replace('/my-info');
  }

  return (
    <ProfileEditLayout title="신체 정보 변경" saving={saving}>
      <Text style={[styles.sectionTitle, styles.bodyTitle]}>신체 정보</Text>
      <PersonalInfoFields section="body" spacious value={draft} onChange={value => { setDraft(value); setError(''); clearSaveError(); }} />
      <SaveProfileButton saving={saving} error={error || saveError} onSave={() => void save()} />
    </ProfileEditLayout>
  );
}

function ProfileEditLayout({ title, saving, children }: { title: string; saving?: boolean; children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerSpacer}><RoundBackButton onPress={() => { if (!saving) router.replace('/my-info'); }} accessibilityLabel="내 정보로 돌아가기" /></View>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function SaveProfileButton({ saving, error, onSave }: { saving: boolean; error: string; onSave: () => void }) {
  return (
    <>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Pressable onPress={onSave} disabled={saving} accessibilityRole="button" accessibilityState={{ busy: saving }} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>{saving ? '저장 중' : '수정 완료'}</Text>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 18, color: '#111111' },
  headerSpacer: { width: 72 },
  saveButton: { minHeight: 52, marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  content: { flexGrow: 1, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 30 },
  sectionTitle: { color: '#111111', fontSize: 18, fontWeight: '600' },
  bodyTitle: { marginBottom: 16 },
  passwordTitle: { marginTop: 24 },
  note: { color: '#667085', marginTop: 6 },
  error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 },
});
