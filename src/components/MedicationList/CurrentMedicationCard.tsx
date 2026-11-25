import MedicationCautionBadge from './MedicationCautionBadge';
import EvidenceCardSection, { EvidenceCardFeedback } from './EvidenceCardSection';
import { useWardEvidenceCard } from '../../hooks/useWardEvidenceCard';
import { getEvidenceCardText } from '../../utils/evidenceCard';
import { getMedicationServerClock } from '../../utils/familyMedication';
import { useRef, useState } from 'react';
import { Platform, Pressable, Share, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Typography/Text';
import { useResponsiveStyles } from '../../hooks/useResponsiveStyles';
import { colors, typography } from '../../theme/tokens';
import type { Medicine } from '../Search/types';
import {
  getLocalDateKey,
  getMedicationScheduleLabel,
  type MedicationSchedule,
} from '../../utils/medicationSchedule';

type Props = { wardId?: string; name?: string; medicines: Medicine[]; schedules: MedicationSchedule[]; cautionIds: ReadonlySet<string> };

export default function CurrentMedicationCard({ wardId, name, medicines, schedules, cautionIds }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const cardRef = useRef<View>(null);
  const [feedback, setFeedback] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [exportingImage, setExportingImage] = useState(false);
  const isWeb = Platform.OS === 'web';
  const evidenceRequest = useWardEvidenceCard(wardId, 'dependent');
  const evidence = evidenceRequest.state.status === 'ready' ? evidenceRequest.state.data : undefined;
  const cardName = evidence?.ward_name || name;
  const title = cardName ? `${cardName}님 복용 카드` : '복용 카드';
  const today = getLocalDateKey(wardId ? getMedicationServerClock().date : new Date());
  const entries = medicines.flatMap(medicine => {
    const registered = schedules.filter(schedule => schedule.medicineId === medicine.id);
    const active = registered.filter(schedule =>
      (!schedule.startDate || schedule.startDate <= today) &&
      (!schedule.endDate || schedule.endDate >= today),
    );
    if (registered.length > 0 && active.length === 0) return [];
    active.sort((a, b) => a.time.localeCompare(b.time));
    const daily = active.length > 0 && active.every(schedule => new Set(schedule.daysOfWeek).size === 7);
    const frequency = daily ? `하루 ${active.length}회` : active.length ? '요일별 복용' : '일정 미설정';
    const times = daily
      ? active.map(schedule => [schedule.timeOfDay, schedule.time].filter(Boolean).join(' ')).join(' · ')
      : getMedicationScheduleLabel(active, medicine.id);
    const scheduleLabel = active.length > 0
      ? times + (active.every(schedule => schedule.isExample) ? ' (예시)' : '')
      : '';
    return [{ medicine, frequency, scheduleLabel }];
  });

  const cautionEntries = entries.filter(({ medicine }) => cautionIds.has(medicine.id));

  const medicationSummary = entries.length
    ? entries.map(({ medicine }) => medicine.name).join(', ')
    : '현재 복용 중인 약·영양제가 없어요.';
  const message = [
    title,
    `현재 복용 중 · ${entries.length}개\n${medicationSummary}`,
    entries.length > 0 && [
      '복용 횟수와 시간',
      ...entries.map(({ medicine, frequency, scheduleLabel }) =>
        [medicine.name, frequency, scheduleLabel].filter(Boolean).join(' · '),
      ),
    ].join('\n'),
    cautionEntries.length > 0 && [
      '복용 주의',
      ...cautionEntries.map(({ medicine }) => medicine.name),
    ].join('\n'),
    evidence && getEvidenceCardText(evidence),
  ].filter(Boolean).join('\n\n');

  async function copyCard() {
    setFeedback('');
    try {
      const copied = await Clipboard.setStringAsync(message);
      setFeedback(copied ? '복용 카드를 복사했어요.' : '복사할 수 없어요.');
    } catch {
      setFeedback('복사할 수 없어요.');
    }
  }

  async function shareText() {
    setShowShareOptions(false);
    setFeedback('');
    try {
      if (Platform.OS !== 'web') {
        await Share.share({ message });
      } else if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({ text: message });
      } else {
        await copyCard();
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setFeedback('공유할 수 없어요. 복사 버튼을 이용해 주세요.');
    }
  }

  async function exportImage() {
    if (exportingImage || !cardRef.current) return;
    setExportingImage(true);
    setShowShareOptions(false);
    setFeedback('');
    try {
      if (!isWeb && !(await Sharing.isAvailableAsync())) {
        setFeedback('이 기기에서는 이미지 공유를 사용할 수 없어요.');
        return;
      }

      const uri = await captureRef(cardRef, {
        format: 'png',
        result: isWeb ? 'data-uri' : 'tmpfile',
      });

      if (isWeb) {
        const link = document.createElement('a');
        link.href = uri;
        link.download = '복용 카드.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          UTI: 'public.png',
          dialogTitle: '복용 카드 공유',
        });
      }
    } catch {
      setFeedback('복용 카드 이미지를 내보낼 수 없어요. 다시 시도해 주세요.');
    } finally {
      setExportingImage(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel="복사" onPress={copyCard} style={styles.action}>
          <Ionicons name="copy-outline" size={16} color={colors.ink} accessible={false} />
          <Text style={styles.actionLabel}>복사</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={exportingImage ? '이미지 준비 중' : '공유'}
          accessibilityState={{ expanded: showShareOptions, disabled: exportingImage }}
          disabled={exportingImage}
          onPress={() => setShowShareOptions(visible => !visible)}
          style={styles.action}
        >
          <Ionicons name="share-outline" size={16} color={colors.ink} accessible={false} />
          <Text style={styles.actionLabel}>{exportingImage ? '이미지 준비 중' : '공유'}</Text>
        </Pressable>
      </View>
      {showShareOptions && (
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" onPress={shareText} style={styles.action}>
            <Text style={styles.actionLabel}>텍스트로 공유</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={exportImage} style={styles.action}>
            <Text style={styles.actionLabel}>{isWeb ? '이미지로 저장' : '이미지로 공유'}</Text>
          </Pressable>
        </View>
      )}
      {feedback ? <Text accessibilityLiveRegion="polite" style={styles.feedback}>{feedback}</Text> : null}
      <View ref={cardRef} collapsable={false} style={styles.card}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            {cardName && <Text style={styles.personName}>{cardName}님 </Text>}복용 카드
          </Text>
        </View>
        <View style={styles.content}>
          <View style={styles.group}>
            <Text accessibilityRole="header" style={styles.heading}>현재 복용 중 · {entries.length}개</Text>
            <Text style={styles.body}>
              {medicationSummary}
            </Text>
          </View>

          {entries.length > 0 && (
            <View style={styles.group}>
              <Text accessibilityRole="header" style={styles.heading}>복용 횟수와 시간</Text>
              {entries.map(({ medicine, frequency, scheduleLabel }) => (
                <View key={medicine.id} style={styles.scheduleRow}>
                  <View style={styles.rowHeading}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text style={styles.frequency}>{frequency}</Text>
                  </View>
                  {scheduleLabel ? <Text style={styles.schedule}>{scheduleLabel}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {cautionEntries.length > 0 && (
            <View style={[styles.group, styles.cautionGroup]}>
              <View style={styles.cautionHeading}>
                <Ionicons name="warning-outline" size={19} color={colors.error} accessible={false} />
                <Text accessibilityRole="header" style={styles.heading}>복용 주의</Text>
              </View>
              {cautionEntries.map(({ medicine }) => (
                <View key={medicine.id} style={styles.cautionRow}>
                  <Text style={styles.medicineName}>{medicine.name}</Text>
                  <MedicationCautionBadge />
                </View>
              ))}
            </View>
          )}
          {evidence && <EvidenceCardSection card={evidence} />}
        </View>
      </View>
      {wardId && <EvidenceCardFeedback request={evidenceRequest} />}
      {evidence && (
        <Pressable accessibilityRole="button" onPress={evidenceRequest.retry} style={styles.action}>
          <Text style={styles.actionLabel}>복약 점검 다시 조회</Text>
        </Pressable>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  container: { width: '95%', alignSelf: 'center', gap: 8 },
  card: { borderWidth: 1, borderColor: colors.border, borderRadius: 24, backgroundColor: '#F6F7F9', overflow: 'hidden' },
  header: { paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { ...typography.sectionTitle, lineHeight: 32 },
  personName: { fontSize: 24, lineHeight: 32, fontWeight: '700' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  action: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, paddingHorizontal: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
  actionLabel: { ...typography.caption, color: colors.ink, fontWeight: '600' },
  feedback: { ...typography.caption, color: colors.body },
  content: { padding: 16, gap: 12 },
  group: { backgroundColor: colors.surface, borderRadius: 16, padding: 14, gap: 8 },
  heading: { ...typography.sectionTitle, fontSize: 16 },
  body: { ...typography.body },
  scheduleRow: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: 8, gap: 4 },
  rowHeading: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  medicineName: { color: colors.ink, fontSize: 15, lineHeight: 22, fontWeight: '600', maxWidth: '100%' },
  frequency: { ...typography.caption, color: colors.ink, fontWeight: '600', backgroundColor: '#F2F4F7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  schedule: { ...typography.caption, color: colors.body },
  cautionGroup: { borderWidth: 1, borderColor: colors.error, backgroundColor: '#FEF6F5' },
  cautionHeading: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cautionRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
});
