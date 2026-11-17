import { StyleSheet } from 'react-native';
import Text from '../Typography/Text';

export default function MedicationCautionBadge() {
  return <Text style={styles.badge}>주의가 필요해요</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: '#B42318',
    backgroundColor: '#FEF3F2',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
});
