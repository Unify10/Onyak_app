import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../../components/Search/AppText/AppText';
import { typography } from '../../theme/tokens';

type MenuItem = {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

const settingItems: MenuItem[] = [
  { label: '알림 설정', icon: 'notifications-outline' },
  { label: '앱 설정', icon: 'settings-outline' },
  { label: '가족 계정 관리', icon: 'people-outline' },
  { label: '비밀번호 변경', icon: 'lock-closed-outline' },
];

const informationItems: MenuItem[] = [
  { label: '개인정보 처리방침', icon: 'document-text-outline' },
  { label: '서비스 이용약관', icon: 'reader-outline' },
  { label: '문의하기', icon: 'chatbubble-ellipses-outline' },
];

type Props = { displayName: string; email: string; onSignOut: () => void };

export default function MyInfo({ displayName, email, onSignOut }: Props) {
  function showNotReady(label: string) {
    Alert.alert(label, `${label} 기능은 준비 중입니다.`);
  }

  function confirmSignOut() {
    Alert.alert('로그아웃', '온약에서 로그아웃할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: onSignOut },
    ]);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <AppText style={styles.title}>내 정보</AppText>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Pressable
        accessibilityRole="button"
        onPress={() => showNotReady('프로필 수정')}
        style={styles.profileCard}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={27} color={stylesValues.green} />
        </View>
        <View style={styles.profileInfo}>
          <AppText style={styles.name}>{displayName}</AppText>
          <AppText style={styles.email}>{email || '이메일 계정'}</AppText>
        </View>
        <Ionicons name="chevron-forward" size={21} color={stylesValues.chevron} />
        </Pressable>

        <AppText style={styles.sectionTitle}>계정 및 앱 설정</AppText>
        <View style={styles.menuCard}>
        {settingItems.map((item, index) => (
          <MenuRow
            key={item.label}
            item={item}
            showBorder={index < settingItems.length - 1}
            onPress={() => showNotReady(item.label)}
          />
        ))}
        </View>

        <AppText style={styles.sectionTitle}>도움말 및 약관</AppText>
        <View style={styles.menuCard}>
        {informationItems.map((item, index) => (
          <MenuRow
            key={item.label}
            item={item}
            showBorder={index < informationItems.length - 1}
            onPress={() => showNotReady(item.label)}
          />
        ))}
        </View>

        <View style={styles.accountCard}>
        <MenuRow
          item={{ label: '로그아웃', icon: 'log-out-outline' }}
          onPress={confirmSignOut}
          destructive
        />
        </View>
        <AppText style={styles.version}>온약 · 버전 1.0.0</AppText>
      </ScrollView>
    </View>
  );
}

function MenuRow({
  item,
  onPress,
  showBorder = false,
  destructive = false,
}: {
  item: MenuItem;
  onPress: () => void;
  showBorder?: boolean;
  destructive?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.menuRow, showBorder && styles.menuBorder]}
    >
      <Ionicons
        name={item.icon}
        size={21}
        color={destructive ? stylesValues.destructive : stylesValues.muted}
      />
      <AppText style={[styles.menuLabel, destructive && styles.destructiveLabel]}>{item.label}</AppText>
      <Ionicons name="chevron-forward" size={20} color={stylesValues.chevron} />
    </Pressable>
  );
}

const stylesValues = {
  green: '#39A887',
  muted: '#8B929D',
  chevron: '#B5BBC3',
  destructive: '#D96A6A',
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F8FA' },
  header: { height: 72, paddingHorizontal: 24, justifyContent: 'center' },
  container: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30, backgroundColor: '#F7F8FA' },
  title: { ...typography.pageTitle, color: '#20242B' },
  profileCard: { minHeight: 100, flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#F0F1F3', borderRadius: 18, backgroundColor: '#FFFFFF', marginBottom: 26 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#E8F6F1', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  profileInfo: { flex: 1 },
  name: { color: '#20242B', fontSize: 17, lineHeight: 24, fontWeight: '700' },
  email: { color: '#8B929D', fontSize: 14, lineHeight: 20, marginTop: 4 },
  sectionTitle: { color: '#20242B', fontSize: 18, lineHeight: 25, fontWeight: '700', marginBottom: 11 },
  menuCard: { paddingHorizontal: 14, borderWidth: 1, borderColor: '#F0F1F3', borderRadius: 16, backgroundColor: '#FFFFFF', marginBottom: 23 },
  accountCard: { paddingHorizontal: 14, borderWidth: 1, borderColor: '#F0F1F3', borderRadius: 16, backgroundColor: '#FFFFFF' },
  menuRow: { minHeight: 59, flexDirection: 'row', alignItems: 'center' },
  menuBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E8EAED' },
  menuLabel: { flex: 1, marginLeft: 12, color: '#303642', fontSize: 15, lineHeight: 22 },
  destructiveLabel: { color: '#D96A6A' },
  version: { marginTop: 24, color: '#9AA1AA', fontSize: 12, textAlign: 'center' },
});
