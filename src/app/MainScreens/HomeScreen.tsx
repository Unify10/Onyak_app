import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

const GREEN = '#39A887';
const INK = '#20242B';
const MUTED = '#8B929D';
const LINE = '#ECEEF1';

const schedule = [
  {
    id: 'morning',
    time: '오전 8:00',
    label: '아침 식후',
    medicines: '비타민D · 오메가3',
  },
  {
    id: 'lunch',
    time: '오후 1:00',
    label: '점심 식후',
    medicines: '혈압약',
  },
  {
    id: 'dinner',
    time: '오후 7:00',
    label: '저녁 식후',
    medicines: '비타민D · 오메가3',
  },
];

export default function HomeScreen() {
  const [completed, setCompleted] = useState<string[]>(['morning']);

  function toggleSchedule(id: string) {
    setCompleted(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText style={styles.logo}>홈</AppText>

        <Pressable
            style={styles.notificationButton}
            onPress={() => {}}
            accessibilityRole="button"
            accessibilityLabel="알림"
        >
            <Ionicons name="notifications-outline" size={22} color={INK} />
        </Pressable>
    </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={styles.date}>10월 26일 월요일</AppText>
        <AppText style={styles.greeting}>안녕하세요, 민지님</AppText>
        <AppText style={styles.subtitle}>
          오늘도 건강한 하루 보내세요.
        </AppText>

        <Pressable style={styles.captureBanner} onPress={() => {}}>
          <View style={styles.captureIcon}>
            <Ionicons name="camera-outline" size={25} color={GREEN} />
          </View>

          <View style={styles.captureText}>
            <AppText style={styles.captureTitle}>
              약을 간편하게 등록해요
            </AppText>
            <AppText style={styles.captureSubtitle}>
              사진을 찍거나 이름으로 검색해 보세요
            </AppText>
          </View>

          <Ionicons name="chevron-forward" size={22} color={GREEN} />
        </Pressable>

        <View style={styles.sectionHeading}>
          <AppText style={styles.sectionTitle}>오늘의 복용 일정</AppText>
          <Pressable onPress={() => {}}>
            <AppText style={styles.moreLink}>전체보기</AppText>
          </Pressable>
        </View>

        <View style={styles.card}>
          {schedule.map((item, index) => {
            const isDone = completed.includes(item.id);

            return (
              <Pressable
                key={item.id}
                style={[
                  styles.scheduleRow,
                  index < schedule.length - 1 && styles.rowBorder,
                ]}
                onPress={() => toggleSchedule(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`${item.label} ${isDone ? '복용 완료' : '복용 예정'}`}
              >
                <View style={[styles.check, isDone && styles.checked]}>
                  {isDone && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>

                <View style={styles.scheduleInfo}>
                  <AppText style={styles.scheduleLabel}>
                    {item.label}
                  </AppText>
                  <AppText style={styles.scheduleMedicines}>
                    {item.medicines}
                  </AppText>
                </View>

                <AppText style={[styles.scheduleTime, isDone && styles.doneText]}>
                  {isDone ? '복용 완료' : item.time}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.warning} onPress={() => {}}>
          <View style={styles.warningIcon}>
            <Ionicons name="warning-outline" size={18} color="#A96D24" />
          </View>
          <AppText style={styles.warningText}>
            복용 중인 약의 상호작용을 확인해 보세요.
          </AppText>
          <Ionicons name="chevron-forward" size={20} color="#A96D24" />
        </Pressable>

        <View style={styles.sectionHeading}>
          <AppText style={styles.sectionTitle}>복용 중인 약</AppText>
          <Pressable onPress={() => {}}>
            <AppText style={styles.moreLink}>더보기</AppText>
          </Pressable>
        </View>

        <View style={styles.medicineRow}>
          <View style={styles.medicineCard}>
            <View style={[styles.medicineIcon, styles.vitaminIcon]}>
              <Ionicons name="sunny-outline" size={23} color="#5595D0" />
            </View>
            <AppText style={styles.medicineName}>비타민D</AppText>
            <AppText style={styles.medicineInfo}>하루 1회 · 영양제</AppText>
          </View>

          <View style={styles.medicineCard}>
            <View style={[styles.medicineIcon, styles.omegaIcon]}>
              <Ionicons name="ellipse" size={19} color="#EBA050" />
            </View>
            <AppText style={styles.medicineName}>오메가3</AppText>
            <AppText style={styles.medicineInfo}>하루 1회 · 영양제</AppText>
          </View>
        </View>

        <View style={styles.sectionHeading}>
          <AppText style={styles.sectionTitle}>가족 계정</AppText>
          <Pressable onPress={() => {}}>
            <AppText style={styles.moreLink}>보기</AppText>
          </Pressable>
        </View>

        <View style={styles.familyCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={GREEN} />
          </View>

          <View style={styles.familyInfo}>
            <AppText style={styles.medicineName}>엄마</AppText>
            <AppText style={styles.medicineInfo}>복용 일정 확인하기</AppText>
          </View>

          <View style={styles.onlineDot} />
          <AppText style={styles.onlineText}>온라인</AppText>
        </View>

        <AppText style={styles.demoNote}>
          약 정보와 가족 상태는 예시입니다. 실제 서비스 연동은 아직 되지 않았어요.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    height: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: INK,
    fontSize: 26,
    fontWeight: '700',
    },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  date: {
    color: MUTED,
    fontSize: 14,
  },
  greeting: {
    color: INK,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    color: MUTED,
    fontSize: 16,
    marginTop: 6,
    marginBottom: 22,
  },
  captureBanner: {
    backgroundColor: '#E8F6F1',
    borderRadius: 18,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },
  captureIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  captureText: {
    flex: 1,
  },
  captureTitle: {
    color: INK,
    fontSize: 18,
    fontWeight: '700',
  },
  captureSubtitle: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
  },
  moreLink: {
    color: GREEN,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    paddingHorizontal: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  scheduleRow: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: LINE,
  },
  check: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD1D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  checked: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleLabel: {
    color: INK,
    fontWeight: '600',
  },
  scheduleMedicines: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  scheduleTime: {
    color: MUTED,
    fontSize: 14,
    marginLeft: 8,
  },
  doneText: {
    color: GREEN,
    fontWeight: '600',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E9',
    borderRadius: 15,
    padding: 14,
    marginTop: 7,
    marginBottom: 25,
  },
  warningIcon: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#FFE9CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  warningText: {
    flex: 1,
    color: '#765322',
    fontSize: 16,
    lineHeight: 22,
  },
  medicineRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 22,
  },
  medicineCard: {
    flex: 1,
    minHeight: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 14,
  },
  medicineIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  vitaminIcon: {
    backgroundColor: '#EAF4FF',
  },
  omegaIcon: {
    backgroundColor: '#FFF2E7',
  },
  medicineName: {
    color: INK,
    fontWeight: '700',
  },
  medicineInfo: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 5,
  },
  familyCard: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 13,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  familyInfo: {
    flex: 1,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginRight: 6,
  },
  onlineText: {
    color: GREEN,
    fontSize: 14,
  },
  demoNote: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 13,
  },
});