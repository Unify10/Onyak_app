import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { useProfile } from '../../providers/ProfileProvider';
import ProfileHero from '../../components/MyInfo/ProfileHero';
import PersonalInfoFields from '../../components/PersonalInfo/PersonalInfoFields';
import { validatePersonalInfo } from '../../utils/personalInfo';

export default function EditProfileScreen() {
  const { profile, saveProfile } = useProfile();
  const { displayName, email, updateDisplayName } = useAuth();
  const [draft, setDraft] = useState(() => ({ ...profile, name: displayName }));
  const [error, setError] = useState('');
  function save() {
    const message = validatePersonalInfo(draft);
    setError(message);
    if (message) return;
    saveProfile({ ...draft, name: draft.name.trim() });
    updateDisplayName(draft.name.trim());
    router.replace('/my-info');
  }
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}><Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" style={styles.headerButton}><Text>뒤로가기</Text></Pressable><Pressable onPress={save} accessibilityRole="button" style={styles.headerButton}><Text>내 정보 수정</Text></Pressable></View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ProfileHero name={displayName} email={email} />
        <PersonalInfoFields value={draft} onChange={next => { setDraft(next); setError(''); }} />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        <View style={styles.notice}><Ionicons name="shield-half" size={22} color="#000000" /><Text style={styles.noticeText}>입력한 신체 정보는 내 정보 화면에 반영됩니다.</Text></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 64, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerButton: { minHeight: 44, justifyContent: 'center' },
  content: { width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 30 },
  error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 14 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, backgroundColor: '#F5F5F7', marginTop: 24 },
  noticeText: { flex: 1, color: '#4B5563', fontSize: 14, lineHeight: 22 },
});
