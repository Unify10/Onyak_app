import Text from '../../../components/Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PersonalInfoFields from '../../../components/PersonalInfo/PersonalInfoFields';
import { validateFamilyInfo, type PersonalInfo } from '../../../utils/personalInfo';

export default function FamilyDetailsScreen({ value, onChange, onBack, onNext }: { value: PersonalInfo; onChange: (value: PersonalInfo) => void; onBack: () => void; onNext: () => void }) {
  const styles = useResponsiveStyles(baseStyles);
  const [error, setError] = useState('');
  function submit() {
    const message = validateFamilyInfo(value);
    setError(message);
    if (!message) onNext();
  }
  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}><Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="가족 화면으로 돌아가기"><Ionicons name="arrow-back" size={22} /></Pressable><Text style={styles.title}>피보호자 계정 생성</Text><View style={styles.headerSpacer} /></View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text style={styles.section}>신체 정보</Text>
        <PersonalInfoFields value={value} onChange={next => { onChange(next); setError(''); }} showAge familyLayout />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      </ScrollView>
      <View style={styles.footer}><Pressable onPress={submit} accessibilityRole="button" style={styles.next}><Text style={styles.nextText}>다음</Text></Pressable></View>
    </KeyboardAvoidingView>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: '50%', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  headerSpacer: { width: 44 },
  title: { fontSize: 18, color: '#111111' },
  content: { padding: 20, paddingBottom: 30, width: '100%', maxWidth: 640, alignSelf: 'center' },
  section: { color: '#657080', fontSize: 15, marginBottom: 28, marginTop: 4 },
  error: { color: '#D92D20', fontSize: 13, lineHeight: 20, marginTop: 16 },
  footer: { width: '100%', maxWidth: 640, alignSelf: 'center', padding: 20, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  next: { minHeight: 50, backgroundColor: '#000000', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nextText: { color: '#FFFFFF', fontSize: 16 },
});
