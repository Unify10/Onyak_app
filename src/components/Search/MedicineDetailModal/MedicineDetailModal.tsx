import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../AppText/AppText';
import type { Medicine } from '../types';

type Props = { medicine: Medicine | null; onClose: () => void };

export default function MedicineDetailModal({ medicine, onClose }: Props) {
  return (
    <Modal visible={!!medicine} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="상세 정보 닫기" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={styles.heading}>
              <AppText style={styles.title}>{medicine?.name}</AppText>
              <AppText style={styles.subtitle}>{medicine?.ingredient} · {medicine?.kind}</AppText>
            </View>
            <Pressable onPress={onClose} hitSlop={8} accessibilityRole="button" accessibilityLabel="상세 닫기">
              <Ionicons name="close-circle" size={28} color="#AAB1BB" />
            </Pressable>
          </View>
          <View style={styles.notice}>
            <Ionicons name="information-circle-outline" size={22} color="#9B6D13" />
            <AppText style={styles.noticeText}>표시된 제품명은 화면 예시입니다. 의약품 정보는 식약처 API 연결 후 확인할 수 있습니다.</AppText>
          </View>
          <InfoRow icon="medkit-outline" title="효능·효과" />
          <InfoRow icon="time-outline" title="용법·용량" />
          <InfoRow icon="warning-outline" title="주의사항·알레르기" />
          <View style={styles.footer}>
            <Ionicons name="shield-checkmark-outline" size={19} color="#7E8795" />
            <AppText style={styles.footerText}>공식 의약품 정보가 연결되면 이 화면에 표시됩니다.</AppText>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function InfoRow({ icon, title }: { icon: React.ComponentProps<typeof Ionicons>['name']; title: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}><Ionicons name={icon} size={20} color="#39A887" /></View>
      <View style={styles.infoText}>
        <AppText style={styles.infoTitle}>{title}</AppText>
        <AppText style={styles.pending}>식약처 의약품 정보 연결 후 표시</AppText>
      </View>
      <Ionicons name="chevron-down" size={19} color="#AAB1BB" />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.38)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 22, paddingTop: 11, paddingBottom: 36 },
  handle: { alignSelf: 'center', width: 42, height: 5, borderRadius: 3, backgroundColor: '#D9DDE3', marginBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 18 },
  heading: { flex: 1, paddingRight: 12 },
  title: { color: '#171C26', fontSize: 23, fontWeight: '700' },
  subtitle: { color: '#7E8795', fontSize: 16, marginTop: 5 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: '#FFF7E7', borderRadius: 12, padding: 13, marginBottom: 15 },
  noticeText: { flex: 1, color: '#75591E', fontSize: 15, lineHeight: 21 },
  infoRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E9EBEF' },
  infoIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#EAF6F2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoText: { flex: 1 },
  infoTitle: { color: '#171C26', fontSize: 17, fontWeight: '600' },
  pending: { color: '#7E8795', fontSize: 14, marginTop: 3 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16 },
  footerText: { flex: 1, color: '#7E8795', fontSize: 14, lineHeight: 20 },
});
