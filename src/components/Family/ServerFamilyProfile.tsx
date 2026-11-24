import { useCallback } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { getFamilyProfile } from '../../api/family';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors, typography } from '../../theme/tokens';
import { emptyPersonalInfo } from '../../utils/personalInfo';
import QueryError from '../Feedback/QueryError';
import ProfileInfoTable from '../MyInfo/ProfileInfoTable';
import RoundBackButton from '../Navigation/RoundBackButton';
import DetailSkeleton from '../Skeleton/DetailSkeleton';
import Text from '../Typography/Text';

type Props = { id: string };

export default function ServerFamilyProfile({ id }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const query = useCallback((token: string, signal: AbortSignal) => getFamilyProfile(id, token, signal), [id]);
  const { state, retry } = useProtectedQuery(query);
  const backButton = (
    <RoundBackButton
      accessibilityLabel="가족 목록으로 돌아가기"
      onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}
    />
  );

  if (state.status === 'loading') {
    return <DetailSkeleton label="가족 정보 불러오는 중" kind="family" header={backButton} />;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        {backButton}
        <Text accessibilityRole="header" style={styles.title}>
          {state.status === 'ready' ? state.data.name : '가족 정보'}
        </Text>
      </View>
      {state.status === 'error' ? <QueryError message={state.message} onRetry={retry} /> : (
        <ProfileInfoTable profile={{
          ...emptyPersonalInfo,
          name: state.data.name,
          birthDate: state.data.birth_date ?? '',
          height: state.data.height == null ? '' : String(state.data.height),
          weight: state.data.weight == null ? '' : String(state.data.weight),
          gender: state.data.gender === 'F' ? '여성' : state.data.gender === 'M' ? '남성' : '선택 안함',
          pregnant: state.data.is_pregnant === true,
          pregnancyStatusProvided: typeof state.data.is_pregnant === 'boolean',
        }} />
      )}
    </ScrollView>
  );
}

const baseStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 24 },
  header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1, ...typography.pageTitle },
});
