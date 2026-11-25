import { useCallback } from 'react';
import { router } from 'expo-router';
import { getFamilyMedications, getFamilyProfile } from '../../api/family';
import { useAuth } from '../../providers/AuthProvider';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { getFamilyMedicationDoses } from '../../utils/familyMedication';
import { toFamilyPersonalInfo } from '../../utils/familyProfile';
import QueryError from '../Feedback/QueryError';
import ProfileInfoTable from '../MyInfo/ProfileInfoTable';
import RoundBackButton from '../Navigation/RoundBackButton';
import DetailSkeleton from '../Skeleton/DetailSkeleton';
import ListSkeleton from '../Skeleton/ListSkeleton';
import RecentWardInvitation from './Invitation/RecentWardInvitation';
import FamilyMedicationOverview from './FamilyMedicationOverview';

type Props = { id: string; initialDate?: string };

export default function ServerFamilyProfile({ id, initialDate }: Props) {
  const { wardInvitations } = useAuth();
  const profileQuery = useCallback((token: string, signal: AbortSignal) => getFamilyProfile(id, token, signal), [id]);
  const medicationQuery = useCallback((token: string, signal: AbortSignal) => getFamilyMedications(id, token, signal), [id]);
  const profileRequest = useProtectedQuery(profileQuery);
  const medicationRequest = useProtectedQuery(medicationQuery);
  const backButton = (
    <RoundBackButton
      accessibilityLabel="가족 목록으로 돌아가기"
      onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}
    />
  );

  if (profileRequest.state.status === 'loading') {
    return <DetailSkeleton label="가족 정보 불러오는 중" kind="family" header={backButton} />;
  }
  if (profileRequest.state.status === 'error') {
    return (
      <>
        {backButton}
        <QueryError message={profileRequest.state.message} onRetry={profileRequest.retry} />
      </>
    );
  }

  const profile = toFamilyPersonalInfo(profileRequest.state.data);
  const invitation = wardInvitations.get(profileRequest.state.data.ward_id);

  const medications = medicationRequest.state;
  const activeMedicationNames = medications.status === 'ready'
    ? medications.data.filter(medication => medication.active).map(medication => medication.drug_name)
    : [];
  const schedule = medications.status === 'ready' ? {
    activeCount: activeMedicationNames.length,
    activeMedicationNames,
    getDoses: (date: Date) => getFamilyMedicationDoses(medications.data, date),
  } : undefined;

  return (
    <FamilyMedicationOverview
      profile={profile}
      initialDate={initialDate}
      profileDetails={(
        <>
          <ProfileInfoTable profile={profile} />
          {invitation && <RecentWardInvitation key={invitation.expiresAt} invitation={invitation} />}
        </>
      )}
      schedule={schedule}
      scheduleFeedback={medications.status === 'error'
        ? <QueryError message={medications.message} onRetry={medicationRequest.retry} />
        : medications.status === 'loading' ? <ListSkeleton label="가족 복용 일정 불러오는 중" /> : null}
    />
  );
}
