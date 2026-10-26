import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

type Medicine = {
  id: string;
  name: string;
  detail: string;
  category: string;
  caution?: boolean;
};

const GREEN = '#39A887';
const INK = '#20242B';
const MUTED = '#8B929D';

export default function MedicationListScreen() {
  const [activeTab, setActiveTab] = useState<'복용 중' | '복용 기록'>('복용 중');

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: '1',
      name: '혈압약',
      detail: '하루 1회 · 아침 식후',
      category: '처방약',
      caution: true,
    },
    {
      id: '2',
      name: '비타민D',
      detail: '하루 1회 · 점심 식후',
      category: '영양제',
    },
    {
      id: '3',
      name: '오메가3',
      detail: '하루 1회 · 저녁 식후',
      category: '영양제',
    },
  ]);

  const [history] = useState<Medicine[]>([
    {
      id: 'history-1',
      name: '감기약',
      detail: '2026.10.12 ~ 2026.10.17',
      category: '일반의약품',
    },
  ]);

  function addMedicine() {
    Alert.alert(
      '약 추가',
      '약 검색 기능은 아직 연결되지 않았습니다. 데모 약을 목록에 추가할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '추가',
          onPress: () => {
            setMedicines(current => [
              ...current,
              {
                id: `demo-${Date.now()}`,
                name: '새로 추가한 약',
                detail: '복용 시간 설정 필요',
                category: '데모',
              },
            ]);
          },
        },
      ],
    );
  }

  function showMedicine(medicine: Medicine) {
    Alert.alert(
      medicine.name,
      `${medicine.category}\n${medicine.detail}\n\n상세 약 정보는 실제 의약품 데이터 연동이 필요합니다.`,
    );
  }

  const visibleMedicines = activeTab === '복용 중' ? medicines : history;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText style={styles.title}>복용 목록</AppText>

        <Pressable
          style={styles.addButton}
          onPress={addMedicine}
          accessibilityRole="button"
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <AppText style={styles.addButtonText}>약 추가</AppText>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <SummaryCard
            count={medicines.length}
            label="복용 중"
            color={GREEN}
          />
          <SummaryCard count={1} label="주의 필요" color="#E69A41" />
          <SummaryCard
            count={history.length}
            label="복용 기록"
            color="#75849A"
          />
        </View>

        <View style={styles.interactionNotice}>
          <View style={styles.noticeIcon}>
            <Ionicons name="warning-outline" size={19} color="#A96D24" />
          </View>

          <View style={styles.noticeCopy}>
            <AppText style={styles.noticeTitle}>
              약물 상호작용을 확인해 보세요
            </AppText>
            <AppText style={styles.noticeDescription}>
              새로운 약을 추가한 뒤 함께 복용해도 되는지 확인하세요.
            </AppText>
          </View>

          <Ionicons name="chevron-forward" size={21} color="#A96D24" />
        </View>

        <View style={styles.segment}>
          {(['복용 중', '복용 기록'] as const).map(tab => {
            const selected = activeTab === tab;

            return (
              <Pressable
                key={tab}
                style={[
                  styles.segmentButton,
                  selected && styles.segmentSelected,
                ]}
                onPress={() => setActiveTab(tab)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <AppText
                  style={[
                    styles.segmentText,
                    selected && styles.segmentTextSelected,
                  ]}
                >
                  {tab}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.listHeading}>
          <AppText style={styles.sectionTitle}>
            {activeTab === '복용 중' ? '현재 복용 중인 약' : '복용 기록'}
          </AppText>
          <AppText style={styles.countText}>
            {visibleMedicines.length}개
          </AppText>
        </View>

        {visibleMedicines.length > 0 ? (
          visibleMedicines.map(medicine => (
            <Pressable
              key={medicine.id}
              style={styles.medicineCard}
              onPress={() => showMedicine(medicine)}
              accessibilityRole="button"
            >
              <View style={styles.pillIcon}>
                <Ionicons name="medical-outline" size={23} color={GREEN} />
              </View>

              <View style={styles.medicineInfo}>
                <View style={styles.nameLine}>
                  <AppText style={styles.medicineName}>
                    {medicine.name}
                  </AppText>

                  {medicine.caution && (
                    <View style={styles.cautionBadge}>
                      <AppText style={styles.cautionText}>주의</AppText>
                    </View>
                  )}
                </View>

                <AppText style={styles.medicineDetail}>
                  {medicine.detail}
                </AppText>
                <AppText style={styles.category}>
                  {medicine.category}
                </AppText>
              </View>

              <Ionicons name="chevron-forward" size={22} color="#B5BBC3" />
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={36} color="#B5BBC3" />
            <AppText style={styles.emptyTitle}>
              아직 복용 기록이 없어요
            </AppText>
            <AppText style={styles.emptyDescription}>
              복용을 마친 약이 여기에 표시됩니다.
            </AppText>
          </View>
        )}

        {activeTab === '복용 중' && (
          <Pressable
            style={styles.bottomAddButton}
            onPress={addMedicine}
            accessibilityRole="button"
          >
            <Ionicons name="add-circle-outline" size={23} color={GREEN} />
            <AppText style={styles.bottomAddText}>
              복용 중인 약 추가하기
            </AppText>
          </Pressable>
        )}

        <AppText style={styles.demoNote}>
          약 목록과 주의 표시는 예시 데이터입니다. 정확한 복용 정보 및 상호작용
          확인에는 실제 의약품 데이터와 서비스 연동이 필요합니다.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({
  count,
  label,
  color,
}: {
  count: number;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.summaryCard}>
      <AppText style={[styles.summaryCount, { color }]}>{count}</AppText>
      <AppText style={styles.summaryLabel}>{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    height: 62,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: INK,
    fontSize: 26,
    fontWeight: '700',
  },
  addButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    minHeight: 92,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: '700',
  },
  summaryLabel: {
    color: MUTED,
    fontSize: 14,
    marginTop: 6,
  },
  interactionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E9',
    borderRadius: 15,
    padding: 14,
    marginBottom: 19,
  },
  noticeIcon: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: '#FFE9CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  noticeCopy: {
    flex: 1,
  },
  noticeTitle: {
    color: '#765322',
    fontSize: 17,
    fontWeight: '600',
  },
  noticeDescription: {
    color: '#8A7555',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#ECEFF2',
    borderRadius: 14,
    padding: 4,
    marginBottom: 21,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 11,
  },
  segmentSelected: {
    backgroundColor: '#FFFFFF',
  },
  segmentText: {
    color: MUTED,
  },
  segmentTextSelected: {
    color: INK,
    fontWeight: '700',
  },
  listHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: {
    flex: 1,
    color: INK,
    fontSize: 20,
    fontWeight: '700',
  },
  countText: {
    color: MUTED,
    fontSize: 14,
  },
  medicineCard: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 14,
    marginBottom: 11,
  },
  pillIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  medicineInfo: {
    flex: 1,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineName: {
    color: INK,
    fontWeight: '700',
  },
  cautionBadge: {
    backgroundColor: '#FFF0DE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  cautionText: {
    color: '#C17A27',
    fontSize: 14,
    fontWeight: '700',
  },
  medicineDetail: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 5,
  },
  category: {
    color: GREEN,
    fontSize: 14,
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    color: INK,
    fontWeight: '700',
    marginTop: 12,
  },
  emptyDescription: {
    color: MUTED,
    fontSize: 15,
    marginTop: 6,
  },
  bottomAddButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: GREEN,
    borderRadius: 14,
    marginTop: 6,
  },
  bottomAddText: {
    color: GREEN,
    fontWeight: '600',
    marginLeft: 7,
  },
  demoNote: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 15,
  },
});