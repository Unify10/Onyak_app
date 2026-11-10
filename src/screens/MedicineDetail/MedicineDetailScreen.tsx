import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MedicineInfoAccordion from '../../components/MedicineDetail/MedicineInfoAccordion';
import type { Medicine } from '../../components/Search/types';
import { useMedications } from '../../providers/MedicationProvider';
import { typography } from '../../theme/tokens';

export default function MedicineDetailScreen({ medicine }: { medicine: Medicine }) {
  const { medicineIds, toggleMedicine } = useMedications();
  const isRegistered = medicineIds.includes(medicine.id);
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>검색</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="검색으로 돌아가기" onPress={() => router.canGoBack() ? router.back() : router.replace('/search')} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color="#111111" /><Text style={styles.backText}>이전</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.image}><Text style={styles.imageText}>약 이미지</Text></View>
          <Text style={styles.name}>{medicine.name}</Text>
        </View>
        <MedicineInfoAccordion />
        <Pressable accessibilityRole="button" style={styles.button} onPress={() => toggleMedicine(medicine.id)}>
          <Text style={styles.buttonText}>{isRegistered ? '복용 목록에서 제거' : '복용 목록에 추가'}</Text>
        </Pressable>
        <Text style={styles.note}>화면 예시입니다. 실제 약 정보는 아직 연결되지 않았습니다.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { minHeight: 72, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { ...typography.pageTitle },
  back: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { fontSize: 15, color: '#111111' },
  content: { paddingHorizontal: 20, paddingBottom: 24, width: '100%', maxWidth: 640, alignSelf: 'center' },
  hero: { alignItems: 'center', paddingBottom: 80 },
  image: { width: 150, height: 150, backgroundColor: '#E5E7EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  imageText: { color: '#FFFFFF', fontSize: 12 },
  name: { fontSize: 20, lineHeight: 28, color: '#111111', textAlign: 'center', marginTop: 12 },
  button: { minHeight: 52, borderRadius: 12, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', marginTop: 34, padding: 14 },
  buttonText: { fontSize: 16, lineHeight: 24, color: '#FFFFFF' },
  note: { fontSize: 12, lineHeight: 18, color: '#8B929D', textAlign: 'center', marginTop: 12 },
});
