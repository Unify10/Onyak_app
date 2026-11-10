import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { useFamilies } from '../../providers/FamilyProvider';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../../providers/ProfileProvider';
import { useAuth } from '../../providers/AuthProvider';
import { useSearchHistory } from '../../providers/SearchHistoryProvider';

export default function DeleteAccountScreen() {
  const styles = useResponsiveStyles(baseStyles);
  const { clearFamilies } = useFamilies();
  const [checked, setChecked] = useState(false);
  const { resetProfile } = useProfile();
  const { signOut } = useAuth();
  const { clearSearches } = useSearchHistory();
  function reset() { resetProfile(); clearSearches(); clearFamilies(); signOut(); router.replace('/login'); }
  return <View style={styles.screen}><Pressable accessibilityRole="button" onPress={() => router.replace('/my-info')} style={styles.header}><Ionicons name="chevron-back" size={22} /><Text style={styles.title}>계정 및 데이터 삭제</Text></Pressable><View style={styles.content}><Text style={styles.heading}>계정 및 데이터 삭제 안내</Text><Text style={styles.description}>현재는 화면 테스트 단계입니다. 아래 버튼은 앱에 입력한 프로필, 가족 정보와 검색 기록을 초기화하고 로그인 화면으로 이동합니다. 실제 서비스 계정은 삭제되지 않습니다.</Text><Pressable accessibilityRole="checkbox" accessibilityState={{ checked }} onPress={() => setChecked(current => !current)} style={styles.checkbox}><Ionicons name={checked ? 'checkbox' : 'square-outline'} size={24} /><Text style={styles.label}>테스트 데이터 초기화 안내를 확인했습니다.</Text></Pressable><Pressable accessibilityRole="button" disabled={!checked} onPress={reset} style={[styles.button, !checked && styles.disabled]}><Text style={styles.buttonText}>테스트 데이터 초기화</Text></Pressable></View></View>;
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' }, header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20 }, title: { fontSize: 16 },
  content: { width: '100%', alignSelf: 'center', padding: 20 }, heading: { fontSize: 22, lineHeight: 32, marginBottom: 24 }, description: { color: '#6B7280', fontSize: 15, lineHeight: 25 },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 28, minHeight: 48 }, label: { flex: 1, fontSize: 14, lineHeight: 22 },
  button: { minHeight: 50, backgroundColor: '#000000', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.4 }, buttonText: { color: '#FFFFFF', fontSize: 16 },
});
