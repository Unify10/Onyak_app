import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../components/Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { typography } from '../../theme/tokens';

export type InformationType = 'announcements' | 'terms' | 'privacy' | 'version';

const titles: Record<InformationType, string> = {
  announcements: '공지사항',
  terms: '이용약관',
  privacy: '개인정보 처리방침',
  version: '앱 버전 정보',
};

export default function AppInformationScreen({ type }: { type: string }) {
  const styles = useResponsiveStyles(baseStyles);
  const informationType = (type in titles ? type : 'announcements') as InformationType;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/my-info')} accessibilityRole="button" accessibilityLabel="내 정보로 돌아가기" style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.title}>{titles[informationType]}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {informationType === 'announcements' && (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={34} color="#98A2B3" />
            <Text style={styles.emptyTitle}>새로운 공지사항이 없습니다.</Text>
            <Text style={styles.body}>새 공지가 등록되면 이곳에서 확인할 수 있습니다.</Text>
          </View>
        )}
        {(informationType === 'terms' || informationType === 'privacy') && (
          <View style={styles.noticeCard}>
            <Text style={styles.sectionTitle}>공식 문구 준비 중</Text>
            <Text style={styles.body}>
              {informationType === 'terms'
                ? '서비스 이용약관이 등록되면 이 화면에서 확인할 수 있습니다.'
                : '개인정보 처리방침이 등록되면 이 화면에서 확인할 수 있습니다.'}
            </Text>
          </View>
        )}
        {informationType === 'version' && (
          <View style={styles.versionCard}>
            <Text style={styles.appName}>온약</Text>
            <View style={styles.versionRow}><Text style={styles.rowLabel}>앱 버전</Text><Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '1.0.0'}</Text></View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.pageTitle },
  content: { paddingHorizontal: 20, paddingBottom: 32, width: '100%', maxWidth: 720, alignSelf: 'center' },
  emptyState: { minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyTitle: { color: '#111111', fontSize: 17, lineHeight: 24, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  body: { color: '#667085', fontSize: 15, lineHeight: 24, marginTop: 8 },
  noticeCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 18, marginTop: 8 },
  sectionTitle: { color: '#111111', fontSize: 18, lineHeight: 26, fontWeight: '600' },
  versionCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 18, marginTop: 8 },
  appName: { color: '#111111', fontSize: 20, lineHeight: 28, paddingVertical: 18 },
  versionRow: { minHeight: 52, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: '#667085', fontSize: 14 },
  rowValue: { color: '#111111', fontSize: 14 },
});
