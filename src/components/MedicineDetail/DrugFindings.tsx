import { StyleSheet, View } from 'react-native';
import type { DrugFinding } from '../../api/drugs';
import Text from '../Typography/Text';

export default function DrugFindings({ findings }: { findings?: DrugFinding[] }) {
  return (
    <View style={styles.panel}>
      <Text accessibilityRole="header" style={styles.title}>서버 금기·주의 정보</Text>
      {!findings?.length && <Text style={styles.body}>{findings ? '서버가 반환한 금기·주의 항목이 없어요.' : '금기·주의 결과를 확인할 수 없어요.'}</Text>}
      {findings?.map(({ label, severity, details }, index) => (
        <View key={`${label}-${index}`} style={styles.finding}>
          <Text style={styles.title}>{severity ? `${severity} · ${label}` : label}</Text>
          {details.length > 0 && <Text style={styles.body}>{details.join('\n')}</Text>}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 10, borderRadius: 14, borderWidth: 1, borderColor: '#D6DAE0', padding: 14 },
  title: { color: '#171C26', fontWeight: '600', fontSize: 15 },
  body: { color: '#475467', fontSize: 14, lineHeight: 21 },
  finding: { gap: 4 },
});
