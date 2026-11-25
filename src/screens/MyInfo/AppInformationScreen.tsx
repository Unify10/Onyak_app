import Constants from 'expo-constants';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SkeletonBlock from '../../components/Skeleton/SkeletonBlock';
import Text from '../../components/Typography/Text';
import { useAppInfo } from '../../hooks/useAppInfo';
import { useAuth } from '../../providers/AuthProvider';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { typography } from '../../theme/tokens';

export type InformationType = 'announcements' | 'terms' | 'privacy' | 'version';

const titles: Record<InformationType, string> = {
  announcements: '공지사항',
  terms: '이용약관',
  privacy: '개인정보 처리방침',
  version: '앱 버전 정보',
};

const documentFields = {
  announcements: 'notice_url',
  terms: 'terms_url',
  privacy: 'privacy_url',
} as const;

export default function AppInformationScreen({ type }: { type: string }) {
  const styles = useResponsiveStyles(baseStyles);
  const { dependentId } = useAuth();
  const { state, retry } = useAppInfo();
  const informationType = Object.hasOwn(titles, type) ? type as InformationType : 'announcements';
  const appInfo = state.status === 'success' ? state.data : null;
  const installedVersion = Constants.expoConfig?.version ?? '1.0.0';
  const documentUrl = informationType === 'version' ? null : appInfo?.[documentFields[informationType]];
  const officialUrl = typeof documentUrl === 'string' && documentUrl.startsWith('https://')
    ? documentUrl as `https://${string}`
    : null;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace(dependentId ? '/dependent/my-info' : '/my-info')} accessibilityRole="button" accessibilityLabel="내 정보로 돌아가기" style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#111111" />
        </Pressable>
        <Text style={styles.title}>{titles[informationType]}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {informationType === 'version' && (
          <View style={styles.versionCard}>
            <Text style={styles.appName}>온약</Text>
            <View style={styles.versionRow}>
              <Text style={styles.rowLabel}>현재 앱 버전</Text>
              <Text style={styles.rowValue}>{installedVersion}</Text>
            </View>
            {state.status !== 'error' && (
              <View style={styles.versionRow}>
                <Text style={styles.rowLabel}>서버 안내 버전</Text>
                {appInfo
                  ? <Text style={styles.rowValue}>{appInfo.version}</Text>
                  : <View accessible accessibilityLabel="버전 정보 불러오는 중" accessibilityState={{ busy: true }}><SkeletonBlock style={styles.versionSkeleton} /></View>}
              </View>
            )}
          </View>
        )}
        {informationType !== 'version' && state.status === 'loading' && (
          <View accessible accessibilityLabel="앱 정보 불러오는 중" accessibilityState={{ busy: true }} style={styles.noticeCard}>
            <SkeletonBlock style={styles.documentSkeleton} />
          </View>
        )}
        {informationType !== 'version' && appInfo && (
          <View style={styles.noticeCard}>
            {officialUrl ? (
              <Link href={officialUrl} target="_blank" asChild>
                <Pressable style={styles.action}>
                  <Text style={styles.actionText}>{titles[informationType]} 열기</Text>
                  <Ionicons name="open-outline" size={18} color="#111111" />
                </Pressable>
              </Link>
            ) : <Text style={styles.body}>아직 등록된 링크가 없어요.</Text>}
          </View>
        )}
        {state.status === 'error' && (
          <View style={styles.noticeCard}>
            <Text accessibilityLiveRegion="polite" style={styles.body}>{state.message}</Text>
            <Pressable accessibilityRole="button" style={styles.action} onPress={retry}>
              <Text style={styles.actionText}>다시 시도</Text>
            </Pressable>
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
  body: { color: '#667085', fontSize: 15, lineHeight: 24, marginTop: 8 },
  noticeCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, padding: 18, marginTop: 8 },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 44, gap: 8 },
  actionText: { color: '#111111', fontSize: 16, lineHeight: 24, fontWeight: '600' },
  documentSkeleton: { width: '60%', height: 18, marginVertical: 13 },
  versionSkeleton: { width: 45, height: 14 },
  versionCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, paddingHorizontal: 18, marginTop: 8 },
  appName: { color: '#111111', fontSize: 20, lineHeight: 28, paddingVertical: 18 },
  versionRow: { minHeight: 52, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: '#667085', fontSize: 14 },
  rowValue: { color: '#111111', fontSize: 14 },
});
