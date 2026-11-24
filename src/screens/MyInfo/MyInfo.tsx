import { lazy, Suspense, useState } from 'react';
import SignOutDialog from '../../components/Account/SignOutDialog';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ProfileOverviewSkeleton from '../../components/MyInfo/ProfileOverviewSkeleton';
import ProfileMenuRow from '../../components/MyInfo/ProfileMenuRow';
import type { PersonalInfo } from '../../utils/personalInfo';
import { useProfile } from '../../providers/ProfileProvider';

const ProfileOverview = lazy(() => import('../../components/MyInfo/ProfileOverview'));

type Props = { displayName: string; email: string; onSignOut: () => void; dependentProfile?: PersonalInfo };
export default function MyInfo({ displayName, email, onSignOut, dependentProfile }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const { profile } = useProfile();
  const [showSignOut, setShowSignOut] = useState(false);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Suspense fallback={<ProfileOverviewSkeleton />}>
        <ProfileOverview name={displayName} email={email} profile={dependentProfile ?? profile} />
      </Suspense>
      {!dependentProfile && <>
      <View style={styles.menu}>
        <ProfileMenuRow label="가족 계정 관리" icon="people" onPress={() => router.push('/family')} />
        <ProfileMenuRow label="개인정보 변경" icon="person" onPress={() => router.push('/edit-profile')} />
        <ProfileMenuRow label="신체정보 변경" icon="fitness-outline" onPress={() => router.push('/edit-profile?tab=body')} last />
      </View>
      <View style={styles.menu}>
        <ProfileMenuRow label="푸시 알림 설정" icon="notifications-outline" onPress={() => router.push('/notification-settings')} />
        <ProfileMenuRow label="공지사항" icon="megaphone-outline" onPress={() => router.push('/information/announcements')} />
        <ProfileMenuRow label="이용약관" icon="document-text-outline" onPress={() => router.push('/information/terms')} />
        <ProfileMenuRow label="개인정보 처리방침" icon="shield-checkmark-outline" onPress={() => router.push('/information/privacy')} />
        <ProfileMenuRow label="앱 버전 정보" icon="information-circle-outline" onPress={() => router.push('/information/version')} last />
      </View>
      </>}
      <View style={styles.menu}>
        <ProfileMenuRow label="로그아웃" last={!!dependentProfile} destructive logout onPress={() => setShowSignOut(true)} />
        {!dependentProfile && <ProfileMenuRow label="계정 및 데이터 삭제" destructive onPress={() => router.push('/delete-account')} last /> }
      </View>
      <SignOutDialog visible={showSignOut} onCancel={() => setShowSignOut(false)} onConfirm={() => { setShowSignOut(false); onSignOut(); }} />
    </ScrollView>
  );
}
const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  menu: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14, marginTop: 26, overflow: 'hidden' },
});
