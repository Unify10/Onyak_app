import { StyleSheet, View } from 'react-native';
import QueryError from '../../components/Feedback/QueryError';
import Text from '../../components/Typography/Text';
import { useWardProfile } from '../../hooks/useWardProfile';
import { useAuth } from '../../providers/AuthProvider';
import MyInfo from '../../screens/MyInfo/MyInfo';
import { toFamilyPersonalInfo } from '../../utils/familyProfile';

export default function DependentMyInfoRoute() {
  const { dependentId, displayName, guardianName, signOut } = useAuth();
  const { state, retry } = useWardProfile();
  if (!dependentId) return null;

  const profile = state.status === 'ready' ? toFamilyPersonalInfo(state.data) : undefined;
  return (
    <MyInfo
      displayName={profile?.name ?? displayName}
      dependent
      guardianName={guardianName}
      dependentProfile={profile}
      onSignOut={signOut}
      profileFeedback={state.status === 'ready' ? null : (
        <View style={styles.feedback}>
          {state.status === 'error'
            ? <QueryError message={state.httpStatus === 403
              ? '현재 로그인한 계정으로 신체정보를 조회할 수 없어요.'
              : '신체정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'} onRetry={retry} />
            : <Text accessibilityLiveRegion="polite" style={styles.loading}>신체정보 불러오는 중</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  feedback: { marginTop: 12 },
  loading: { color: '#6B7280', fontSize: 14, textAlign: 'center' },
});
