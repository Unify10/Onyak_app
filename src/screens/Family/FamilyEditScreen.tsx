import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../components/Typography/Text';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';
import { validateFamilyInfo, type PersonalInfo } from '../../utils/personalInfo';

export default function FamilyEditScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { families, updateFamily } = useFamilies();
  const family = families.find(item => item.id === id);
  const [draft, setDraft] = useState<PersonalInfo | null>(() => family ? { ...family.details } : null);
  const [error, setError] = useState('');

  function close() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/family');
  }

  function save() {
    if (!family || !draft) return;
    const message = validateFamilyInfo(draft);
    setError(message);
    if (message) return;
    updateFamily(family.id, draft);
    router.replace('/(tabs)/family');
  }

  return <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.header}>
      <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="가족 목록으로 돌아가기" style={styles.headerButton}><Ionicons name="chevron-back" size={22} color="#111111" /></Pressable>
      <Text style={styles.headerTitle}>가족 정보 수정</Text>
      <View style={styles.headerSpacer} />
    </View>
    {draft ? <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>{family?.details.name}님의 정보를 수정할 수 있습니다.</Text>
      <PersonalInfoFields value={draft} onChange={next => { setDraft(next); setError(''); }} showAge familyLayout />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Pressable onPress={save} accessibilityRole="button" style={styles.saveButton}><Text style={styles.saveButtonText}>수정 완료</Text></Pressable>
    </ScrollView> : <View style={styles.notFound}><Text style={styles.description}>가족 정보를 찾을 수 없습니다.</Text><Pressable onPress={close} style={styles.saveButton}><Text style={styles.saveButtonText}>가족 목록으로</Text></Pressable></View>}
  </KeyboardAvoidingView>;
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { width: 44, minHeight: 44, justifyContent: 'center' }, headerTitle: { fontSize: 18, color: '#111111' }, headerSpacer: { width: 44 },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 }, description: { color: '#667085', fontSize: 15, lineHeight: 23, marginBottom: 22 },
  saveButton: { minHeight: 52, marginTop: 24, padding: 14, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }, saveButtonText: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 }, error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 }, notFound: { padding: 20 },
});
