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

type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  status: string;
  online: boolean;
  initials: string;
};

const GREEN = '#39A887';
const INK = '#20242B';
const MUTED = '#8B929D';

export default function FamilyScreen() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 'mom',
      name: '김영희',
      relation: '엄마',
      status: '오늘의 복용 완료 1 / 2',
      online: true,
      initials: '엄',
    },
    {
      id: 'dad',
      name: '김철수',
      relation: '아빠',
      status: '마지막 접속 2시간 전',
      online: false,
      initials: '아',
    },
  ]);

  function createFamilyAccount() {
    Alert.alert(
      '가족 계정 만들기',
      '가족 초대 기능은 실제 계정 연동이 필요합니다. 데모 구성원을 추가할까요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '추가',
          onPress: () => {
            setMembers(current => [
              ...current,
              {
                id: `guest-${Date.now()}`,
                name: '초대 대기 중',
                relation: '가족',
                status: '초대 링크 연동 필요',
                online: false,
                initials: '?',
              },
            ]);
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText style={styles.title}>가족</AppText>

        <Pressable
          style={styles.headerButton}
          onPress={() =>
            Alert.alert('가족 설정', '가족 계정 설정은 실제 연동이 필요합니다.')
          }
          accessibilityRole="button"
          accessibilityLabel="가족 설정"
        >
          <Ionicons name="settings-outline" size={22} color={INK} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introCard}>
          <View style={styles.familyIllustration}>
            <Ionicons name="people" size={36} color={GREEN} />
          </View>

          <AppText style={styles.introTitle}>
            가족 건강을 함께 챙겨요
          </AppText>

          <AppText style={styles.introDescription}>
            가족의 복용 일정과 건강 정보를 함께 확인할 수 있어요.
          </AppText>

          <Pressable
            style={styles.createButton}
            onPress={createFamilyAccount}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <AppText style={styles.createButtonText}>
              가족 계정 만들기
            </AppText>
          </Pressable>
        </View>

        <View style={styles.sectionHeading}>
          <AppText style={styles.sectionTitle}>가족 구성원</AppText>
          <AppText style={styles.memberCount}>{members.length}명</AppText>
        </View>

        {members.map(member => (
          <Pressable
            key={member.id}
            style={styles.memberCard}
            onPress={() =>
              Alert.alert(
                member.name,
                `${member.relation} · ${member.status}\n상세 건강 정보는 실제 계정 연동 후 확인할 수 있습니다.`,
              )
            }
            accessibilityRole="button"
          >
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>{member.initials}</AppText>
              {member.online && <View style={styles.onlineDot} />}
            </View>

            <View style={styles.memberInfo}>
              <View style={styles.nameRow}>
                <AppText style={styles.memberName}>{member.name}</AppText>
                <AppText style={styles.relation}>{member.relation}</AppText>
              </View>

              <AppText style={styles.memberStatus}>{member.status}</AppText>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#B5BBC3" />
          </Pressable>
        ))}

        <Pressable
          style={styles.inviteCard}
          onPress={createFamilyAccount}
          accessibilityRole="button"
        >
          <View style={styles.inviteIcon}>
            <Ionicons name="person-add-outline" size={22} color={GREEN} />
          </View>

          <View style={styles.inviteInfo}>
            <AppText style={styles.inviteTitle}>가족 초대하기</AppText>
            <AppText style={styles.inviteDescription}>
              초대 링크 공유 기능은 데모 상태입니다.
            </AppText>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#B5BBC3" />
        </Pressable>

        <AppText style={styles.note}>
          가족 구성원과 온라인 상태는 예시 데이터입니다. 초대 및 정보 공유는
          실제 계정 기능이 연결되어야 사용할 수 있습니다.
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
  headerButton: {
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
  introCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 22,
    paddingVertical: 25,
    marginBottom: 27,
  },
  familyIllustration: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  introTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  introDescription: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    minHeight: 54,
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: GREEN,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  sectionTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  memberCount: {
    color: MUTED,
    fontSize: 14,
  },
  memberCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 14,
    marginBottom: 11,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
    position: 'relative',
  },
  avatarText: {
    color: GREEN,
    fontWeight: '700',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    color: INK,
    fontWeight: '700',
  },
  relation: {
    color: MUTED,
    fontSize: 14,
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
    marginLeft: 8,
  },
  memberStatus: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
  },
  inviteCard: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 14,
    marginTop: 7,
  },
  inviteIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteTitle: {
    color: INK,
    fontWeight: '700',
  },
  inviteDescription: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  note: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
    paddingHorizontal: 2,
  },
});