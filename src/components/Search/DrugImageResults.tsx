import { Pressable, StyleSheet, View } from 'react-native';
import type { DrugCandidate, DrugFinding } from '../../api/drugs';
import DrugFindings from '../MedicineDetail/DrugFindings';
import AppText from './AppText/AppText';

type Props = {
  candidates: DrugCandidate[];
  findings?: DrugFinding[];
  analyzed: boolean;
  onSelect: (candidate: DrugCandidate) => void;
};

export default function DrugImageResults({ candidates, findings, analyzed, onSelect }: Props) {
  return (
    <View style={styles.section}>
      <AppText style={styles.heading}>사진에서 찾은 약품 후보</AppText>
      {candidates.length === 0 && <AppText style={styles.empty}>약품 후보를 확인하지 못했어요. 약 이름으로 검색해 주세요.</AppText>}
      {candidates.map(candidate => (
        <Pressable key={candidate.drugId ?? candidate.name} style={styles.row} accessibilityRole="button" onPress={() => onSelect(candidate)}>
          <AppText>{candidate.name}</AppText>
        </Pressable>
      ))}
      {analyzed && <DrugFindings findings={findings} />}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 8, marginBottom: 20 },
  heading: { color: '#171C26', fontSize: 16, fontWeight: '700' },
  row: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: '#D6DAE0' },
  empty: { color: '#475467', lineHeight: 21 },
});
