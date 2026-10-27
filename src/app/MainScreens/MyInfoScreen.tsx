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

// 화면에서 공통으로 쓰는 색상과 설정 항목
const GREEN = '#39A887';
const INK = '#20242B';
const MUTED = '#8B929D';

const menuItems = [
  { label: '알림 설정', icon: 'notifications-outline' as const },
  { label: '앱 설정', icon: 'settings-outline' as const },
  { label: '가족 계정 관리', icon: 'people-outline' as const },
  { label: '비밀번호 변경', icon: 'lock-closed-outline' as const },
  { label: '개인정보 처리방침', icon: 'document-text-outline' as const },
];

// 내 정보 화면
export default function MyInfoScreen() {
  // 서버 연동 전에는 메뉴 선택 내용을 안내창으로 표시합니다.
  function handleMenu(label: string) {
    if (label === '로그아웃') {
      Alert.alert(
        '로그아웃',
        '로그아웃 기능은 실제 계정 연동이 필요합니다.',
        [{ text: '확인' }],
      );
      return;
    }

    if (label === '계정 및 데이터 삭제') {
      Alert.alert(
        '계정 및 데이터 삭제',
        '계정 삭제 기능은 실제 계정 연동이 필요합니다.',
        [{ text: '확인' }],
      );
      return;
    }

    Alert.alert(label, `${label} 기능은 아직 연결되지 않았습니다.`);
  }

  // 화면 렌더링
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <AppText style={styles.title}>내 정보</AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.profileCard}
          onPress={() => handleMenu('프로필 수정')}
          accessibilityRole="button"
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={29} color={GREEN} />
          </View>

          <View style={styles.profileInfo}>
            <AppText style={styles.name}>김민지</AppText>
            <AppText style={styles.email}>minji@example.com</AppText>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#B5BBC3" />
        </Pressable>

        <AppText style={styles.sectionTitle}>계정 및 앱 설정</AppText>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <MenuRow
              key={item.label}
              label={item.label}
              icon={item.icon}
              showBorder={index < menuItems.length - 1}
              onPress={() => handleMenu(item.label)}
            />
          ))}
        </View>

        <AppText style={styles.sectionTitle}>계정 관리</AppText>

        <View style={styles.menuCard}>
          <MenuRow
            label="로그아웃"
            icon="log-out-outline"
            onPress={() => handleMenu('로그아웃')}
            destructive
            showBorder
          />
          <MenuRow
            label="계정 및 데이터 삭제"
            icon="trash-outline"
            onPress={() => handleMenu('계정 및 데이터 삭제')}
            destructive
          />
        </View>

        <AppText style={styles.version}>온약 앱 · 버전 1.0.0</AppText>
        <AppText style={styles.note}>
          프로필과 설정은 예시 화면입니다. 계정 관련 메뉴는 실제 서비스 연동 후
          사용할 수 있습니다.
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

// 설정 메뉴에서 반복해서 쓰는 행
function MenuRow({
  label,
  icon,
  showBorder = false,
  destructive = false,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  showBorder?: boolean;
  destructive?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.menuRow, showBorder && styles.menuBorder]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Ionicons
        name={icon}
        size={22}
        color={destructive ? '#D96A6A' : MUTED}
      />

      <AppText
        style={[
          styles.menuLabel,
          destructive && styles.destructiveLabel,
        ]}
      >
        {label}
      </AppText>

      <Ionicons name="chevron-forward" size={22} color="#B5BBC3" />
    </Pressable>
  );
}

// 내 정보 화면 스타일
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    height: 62,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: INK,
    fontSize: 26,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  profileCard: {
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 16,
    marginBottom: 27,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E8F6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: INK,
    fontWeight: '700',
  },
  email: {
    color: MUTED,
    fontSize: 15,
    marginTop: 5,
  },
  sectionTitle: {
    color: INK,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    paddingHorizontal: 14,
    marginBottom: 25,
  },
  menuRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8EAED',
  },
  menuLabel: {
    flex: 1,
    color: INK,
    marginLeft: 13,
  },
  destructiveLabel: {
    color: '#D96A6A',
  },
  version: {
    textAlign: 'center',
    color: MUTED,
    fontSize: 14,
    marginTop: 2,
  },
  note: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 9,
  },
});
