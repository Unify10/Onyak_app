import Text from '../../Typography/Text';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { FamilyDraft } from '../../../providers/FamilyProvider';

type Props = {
  family: FamilyDraft;
  onDelete: (id: string) => void;
};

export default function FamilyItem({ family, onDelete }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.summary}>
        <Pressable accessibilityRole="button" accessibilityLabel={`${family.details.name} 복용 현황 보기`} onPress={() => router.push(`/family/${family.id}`)} style={styles.openProfile}>
          <View style={styles.avatar}><Ionicons name="person" size={24} color="#667085" /></View>
          <View style={styles.details}>
            <Text style={styles.name}>{family.details.name}</Text>
            <Text style={styles.description}>{family.details.gender} · 만 {family.details.age}세 · {family.details.height}cm · {family.details.weight}kg</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#98A2B3" />
        </Pressable>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" accessibilityLabel={`${family.details.name} 정보 수정`} onPress={() => router.push(`/family/edit/${family.id}`)} style={styles.iconButton}><Ionicons name="create-outline" size={21} color="#344054" /></Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={`${family.details.name} 계정 삭제`} onPress={() => setConfirmingDelete(true)} style={styles.iconButton}><Ionicons name="trash-outline" size={21} color="#D92D20" /></Pressable>
        </View>
      </View>
      {confirmingDelete && (
        <View style={styles.deleteConfirm}>
          <Text style={styles.confirmText}>{family.details.name} 계정을 삭제할까요?</Text>
          <Pressable accessibilityRole="button" onPress={() => setConfirmingDelete(false)} style={styles.cancelButton}><Text style={styles.cancelText}>취소</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => onDelete(family.id)} style={styles.deleteButton}><Text style={styles.deleteText}>삭제</Text></Pressable>
        </View>
      )}
    </View>
  );
}

const baseStyles = StyleSheet.create({
  card: { width: '100%', borderRadius: 15, borderColor: '#E5E7EB', borderWidth: 1, padding: 12 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  openProfile: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden', backgroundColor: '#F2F4F7', alignItems: 'center', justifyContent: 'center' },
  details: { flex: 1, minWidth: 0, gap: 2 },
  name: { fontSize: 18, lineHeight: 24, color: '#111111' },
  description: { fontSize: 13, lineHeight: 18, color: '#667085' },
  actions: { flexDirection: 'row', gap: 2 },
  iconButton: { width: 38, height: 40, alignItems: 'center', justifyContent: 'center' },
  deleteConfirm: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB', marginTop: 12, paddingTop: 12, flexWrap: 'wrap' },
  confirmText: { flex: 1, minWidth: 150, color: '#344054', fontSize: 14 },
  deleteButton: { minHeight: 40, minWidth: 68, borderRadius: 10, backgroundColor: '#D92D20', alignItems: 'center', justifyContent: 'center' },
  deleteText: { color: '#FFFFFF', fontSize: 14 },
  cancelButton: { minHeight: 40, minWidth: 68, borderRadius: 10, borderWidth: 1, borderColor: '#D0D5DD', alignItems: 'center', justifyContent: 'center' },
  cancelText: { color: '#344054', fontSize: 14 },
});
