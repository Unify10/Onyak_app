import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type Medication = {
  id: string;
  name: string;
  schedule: string;
  startDate: string;
  caution?: boolean;
};

export default function MedicationItem({ medication }: { medication: Medication }) {
  return (
    <Pressable accessibilityRole="button" style={styles.card} onPress={() => router.push({ pathname: '/medicine/[id]', params: { id: medication.id } })}>
      <View style={styles.medicineImage}><Text style={styles.imagePlaceholder}>약 이미지</Text></View>
      <View style={styles.details}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{medication.name}</Text>
          {medication.caution && <Text style={styles.cautionBadge}>주의가 필요해요!</Text>}
        </View>
        <Text style={styles.schedule}>{medication.schedule}</Text>
        <Text style={styles.date}>{medication.startDate}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 112, borderRadius: 16, borderWidth: 1, borderColor: '#E1E4E8', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  medicineImage: { width: 62, height: 78, borderRadius: 12, backgroundColor: '#E6E8EB', alignItems: 'center', justifyContent: 'center' },
  imagePlaceholder: { color: '#FFFFFF', fontSize: 11 },
  details: { flex: 1, gap: 5 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  name: { color: '#17191D', fontSize: 17 },
  cautionBadge: { borderWidth: 1, borderColor: '#111111', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 2, color: '#111111', fontSize: 12 },
  schedule: { color: '#758093', fontSize: 15 },
  date: { color: '#A4ADBA', fontSize: 14 },
  chevron: { color: '#C8CDD5', fontSize: 30, lineHeight: 32, marginLeft: 2 },
});
