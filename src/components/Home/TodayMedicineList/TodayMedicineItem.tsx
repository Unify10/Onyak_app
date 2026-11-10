import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { StyleSheet, View } from 'react-native';
import TodayMedicineCheckbox from './TodayMedicineCheckbox';

interface MedicineData {
  title: string;
  completed: boolean;
  onToggle: () => void;
  timeOfDay: '아침' | '점심' | '저녁' | '취침 전' | '공복' | '식사와 관계 없이';
  time: string;
}

export default function TodayMedicineItem({ title, timeOfDay, time, completed, onToggle }: MedicineData) {
  const styles = useResponsiveStyles(baseStyles, compactStyles);
  return (
    <View style={styles.cardContainer}>
      <View>
        <TodayMedicineCheckbox checked={completed} onToggle={onToggle} label={title} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.todayMedicineItemTitle, completed && styles.completedText]}>{title}</Text>
        <Text style={[styles.todayMedicineItemInfo, completed && styles.completedText]}>
          {timeOfDay} · {time}
        </Text>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  completedText: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    gap: 15,
  },
  todayMedicineItemTitle: {
    fontSize: 20,
  },
  todayMedicineItemInfo: {
    fontSize: 16,
  },
});
const compactStyles = StyleSheet.create({ cardContainer: { paddingVertical: 8, paddingHorizontal: 12, gap: 12 }, todayMedicineItemTitle: { fontSize: 18 }, todayMedicineItemInfo: { fontSize: 14, lineHeight: 20 } });
