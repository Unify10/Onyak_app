import { useCallback, useState } from 'react';
import { router, useIsFocused } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { getFamilyMedications, getFamilyProfile } from '../../api/family';
import { useProtectedQuery } from '../../hooks/useProtectedQuery';
import { getFamilyMedicationDoses } from '../../utils/familyMedication';
import { toFamilyPersonalInfo } from '../../utils/familyProfile';
import QueryError from '../Feedback/QueryError';
import ProfileInfoTable from '../MyInfo/ProfileInfoTable';
import RoundBackButton from '../Navigation/RoundBackButton';
import RecentWardInvitation from './Invitation/RecentWardInvitation';
import FamilyMedicationOverview from './FamilyMedicationOverview';
import FamilyMedicationManager from '../MedicationList/FamilyMedicationManager';
import Text from '../Typography/Text';
import WardEvidenceCard from './WardEvidenceCard';

type Props = { id: string; initialDate?: string };

export default function ServerFamilyProfile({ id, initialDate }: Props) {
  const [calendarRevision, setCalendarRevision] = useState(0);
  const profileQuery = useCallback((token: string, signal: AbortSignal) => getFamilyProfile(id, token, signal), [id]);
  const medicationQuery = useCallback((token: string, signal: AbortSignal) => getFamilyMedications(id, token, signal), [id]);
  const profileRequest = useProtectedQuery(profileQuery, useIsFocused());
  const medicationRequest = useProtectedQuery(medicationQuery);
  const backButton = (
    <RoundBackButton
      accessibilityLabel="가족 목록으로 돌아가기"
      onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/family')}
    />
  );

  if (profileRequest.state.status === 'loading') {
    return (
      <FamilyMedicationOverview
        initialDate={initialDate}
        profileDetails={<ProfileInfoTable loading />}
        scheduleLoading
      />
    );
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
          <Pressable accessibilityRole="button" style={styles.editButton} onPress={() => router.push({ pathname: '/family/edit/[id]', params: { id } })}>
            <Text style={styles.editLabel}>가족 정보 수정</Text>
          </Pressable>
          <RecentWardInvitation key={id} wardId={profileRequest.state.data.ward_id} />
          <WardEvidenceCard wardId={id} revision={calendarRevision} />
        </>
      )}
      wardId={id}
      calendarRevision={calendarRevision}
      medicationManagement={medications.status === 'ready' && medications.data.length > 0 ? (
        <>
          <Text accessibilityRole="header">가족 복용 목록</Text>
          <FamilyMedicationManager
            records={medications.data}
            role="guardian"
            onChanged={() => {
              setCalendarRevision(value => value + 1);
              medicationRequest.retry();
            }}
          />
        </>
      ) : null}
      schedule={schedule}
      scheduleLoading={medications.status === 'loading'}
      scheduleFeedback={medications.status === 'error'
        ? <QueryError message={medications.message} onRetry={medicationRequest.retry} />
        : null}
    />
  );
}

const styles = StyleSheet.create({
  editButton: { marginTop: 12, minHeight: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  editLabel: { color: '#344054', fontSize: 15 },
});
