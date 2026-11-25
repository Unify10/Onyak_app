import { Pressable, StyleSheet, View } from 'react-native';
import type { WardMedicationCheck } from '../../api/medicationSafety';
import Text from '../Typography/Text';
import DrugFindings from './DrugFindings';

type Props = { result: WardMedicationCheck; onRetry: () => void };

const severityLabels: Record<string, string> = { CONTRAINDICATED: '금기', CAUTION: '주의' };

export default function MedicationPrecheckResult({ result, onRetry }: Props) {
  const patient = result.status === 'precheck' ? result.report.patient : result.patient;
  const age = patient?.age == null ? '나이 미확인' : `만 ${patient.age}세`;
  const pregnancy = patient?.pregnant == null ? '임신 여부 미확인' : patient.pregnant ? '임신 중' : '임신 여부 해당 없음';

  return (
    <View style={styles.content}>
      <Text style={styles.detail}>{age} · {pregnancy}</Text>
      {result.status === 'dur-only' ? (
        <Text style={styles.notice}>신체정보 기준 DUR 조회 결과예요. 복용 중인 약과의 병용금기·성분 중복은 검사하지 못했어요.</Text>
      ) : (
        <>
          <Text accessibilityLiveRegion="polite" style={[
            styles.notice,
            result.report.level === 'DANGER' && styles.danger,
            result.report.level === 'CAUTION' && styles.caution,
          ]}>{result.report.headline}</Text>
          {result.report.interactions.map((interaction, index) => (
            <View key={`${interaction.kind}-${index}`} style={styles.interaction}>
              <Text style={styles.label}>{[severityLabels[interaction.severity], interaction.kind].filter(Boolean).join(' · ')}</Text>
              {interaction.item_names.length > 0 && <Text style={styles.detail}>{interaction.item_names.join(' · ')}</Text>}
              {interaction.detail && <Text style={styles.detail}>{interaction.detail}</Text>}
            </View>
          ))}
          {result.report.warnings.map((warning, index) => <Text key={`${warning}-${index}`} style={styles.detail}>{warning}</Text>)}
        </>
      )}
      <DrugFindings findings={result.findings} />
      {result.status === 'precheck' && result.report.disclaimer && <Text style={styles.detail}>{result.report.disclaimer}</Text>}
      {(result.status === 'dur-only' || result.report.level === 'UNKNOWN') && (
        <Pressable accessibilityRole="button" style={styles.retry} onPress={onRetry}>
          <Text style={styles.retryLabel}>전체 점검 다시 시도</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 10 },
  detail: { color: '#475467', fontSize: 14, lineHeight: 21 },
  notice: { color: '#344054', backgroundColor: '#F2F4F7', borderRadius: 10, padding: 12, fontSize: 14, lineHeight: 21 },
  danger: { color: '#B42318', backgroundColor: '#FFF1F0' },
  caution: { color: '#854A0E', backgroundColor: '#FFF5DB' },
  label: { color: '#171C26', fontWeight: '600', fontSize: 15 },
  interaction: { borderWidth: 1, borderRadius: 12, borderColor: '#D6DAE0', padding: 12, gap: 4 },
  retryLabel: { color: '#171C26', fontWeight: '400', fontSize: 15 },
  retry: { minHeight: 44, alignSelf: 'flex-start', justifyContent: 'center' },
});
