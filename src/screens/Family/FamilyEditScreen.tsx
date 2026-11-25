import { Redirect, useLocalSearchParams, router } from 'expo-router';
import { useCallback, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFamilyProfile, patchFamilyProfile } from '../../api/family';
import QueryError from '../../components/Feedback/QueryError';
import ListSkeleton from '../../components/Skeleton/ListSkeleton';
import Text from '../../components/Typography/Text';
import { useAccountMutation } from '../../hooks/useAccountMutation';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { useAuth } from '../../providers/AuthProvider';
import { toFamilyPersonalInfo } from '../../utils/familyProfile';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';
import { validateFamilyInfo, validatePersonalInfo, type PersonalInfo } from '../../utils/personalInfo';

export default function FamilyEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, dependentId } = useAuth();
  const { families, updateFamily } = useFamilies();
  if (!isAuthenticated) return <Redirect href={dependentId ? '/dependent' : '/login'} />;
  if (id && /^\d+$/.test(id)) return <ServerFamilyEdit key={id} id={id} />;

  const family = families.find(item => item.id === id);
  if (!family) {
    return <FamilyEditLayout><View style={baseStyles.notFound}><Text style={baseStyles.description}>가족 정보를 찾을 수 없습니다.</Text></View></FamilyEditLayout>;
  }

  return <FamilyEditForm key={family.id} profile={family.details} onSave={draft => {
    updateFamily(family.id, draft);
    router.replace('/(tabs)/family');
  }} />;
}

function ServerFamilyEdit({ id }: { id: string }) {
  const query = useCallback((token: string, signal: AbortSignal) => getFamilyProfile(id, token, signal), [id]);
  const { state, retry } = useProtectedQuery(query);
  const { busy, error, run, clearError } = useAccountMutation('가족 정보를 저장하지 못했어요.');
  if (state.status !== 'ready') {
    return (
      <FamilyEditLayout>
        {state.status === 'error' ? <QueryError message={state.message} onRetry={retry} /> : <ListSkeleton label="가족 정보 불러오는 중" />}
      </FamilyEditLayout>
    );
  }
  const profile = toFamilyPersonalInfo(state.data);

  async function save(draft: PersonalInfo) {
    const name = draft.name.trim();
    const gender = draft.gender === '남성' ? 'M' : draft.gender === '여성' ? 'F' : undefined;
    const pregnant = gender === 'M' ? false : draft.pregnancyStatusProvided ? draft.pregnant : undefined;
    const result = await run((token, signal) => patchFamilyProfile(id, {
      name: name !== profile.name ? name : undefined,
      height: draft.height && draft.height !== profile.height ? Number(draft.height) : undefined,
      weight: draft.weight && draft.weight !== profile.weight ? Number(draft.weight) : undefined,
      gender: draft.gender !== profile.gender ? gender : undefined,
      is_pregnant: pregnant !== undefined && (!profile.pregnancyStatusProvided || pregnant !== profile.pregnant) ? pregnant : undefined,
    }, token, signal));
    if (result.ok) {
      if (router.canGoBack()) router.back();
      else router.replace({ pathname: '/family/[id]', params: { id } });
    }
  }

  return <FamilyEditForm profile={profile} server busy={busy} error={error} onChange={clearError} onSave={save} />;
}

function FamilyEditForm({ profile, server, busy, error, onChange, onSave }: {
  profile: PersonalInfo;
  server?: boolean;
  busy?: boolean;
  error?: string;
  onChange?: () => void;
  onSave: (draft: PersonalInfo) => void;
}) {
  const styles = useResponsiveStyles(baseStyles);
  const [draft, setDraft] = useState(profile);
  const [validation, setValidation] = useState('');

  function save() {
    const value = { ...draft, height: draft.height.trim().replace(',', '.'), weight: draft.weight.trim().replace(',', '.') };
    const message = server ? validatePersonalInfo(value) : validateFamilyInfo(value);
    setValidation(message);
    if (!busy && !message) onSave(value);
  }

  return (
    <FamilyEditLayout busy={busy}>
      <Text style={styles.description}>{profile.name}님의 정보를 수정할 수 있습니다.</Text>
      <PersonalInfoFields value={draft} onChange={next => { setDraft(next); setValidation(''); onChange?.(); }} showAge={!server} familyLayout />
      {validation || error ? <Text accessibilityRole="alert" style={styles.error}>{validation || error}</Text> : null}
      <Pressable onPress={save} disabled={busy} accessibilityRole="button" accessibilityState={{ busy }} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>{busy ? '저장 중' : '수정 완료'}</Text>
      </Pressable>
    </FamilyEditLayout>
  );
}

function FamilyEditLayout({ busy, children }: { busy?: boolean; children: ReactNode }) {
  const styles = useResponsiveStyles(baseStyles);
  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/family');
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable onPress={close} disabled={busy} accessibilityRole="button" accessibilityLabel="가족 화면으로 돌아가기" style={styles.headerButton}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
        <Text style={styles.headerTitle}>가족 정보 수정</Text>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { width: 44, minHeight: 44, justifyContent: 'center' }, headerTitle: { fontSize: 18, color: '#111111' }, headerSpacer: { width: 44 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 }, description: { color: '#667085', fontSize: 15, lineHeight: 23, marginBottom: 22 },
  saveButton: { minHeight: 52, marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }, saveButtonText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 }, error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 }, notFound: { padding: 20 },
});
