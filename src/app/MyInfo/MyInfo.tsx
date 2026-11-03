import { ScrollView, StyleSheet, Text, View } from 'react-native';

const menuItems = ['알림 설정', '앱 설정', '가족 계정 관리', '개인정보 처리방침'];

export default function MyInfo() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>내 정보</Text>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>김</Text></View>
        <View>
          <Text style={styles.name}>김민지</Text>
          <Text style={styles.email}>minji@example.com</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>계정 및 앱 설정</Text>
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <View key={item} style={[styles.menuRow, index < menuItems.length - 1 && styles.menuBorder]}>
            <Text style={styles.menuLabel}>{item}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#FFFFFF' },
  title: { color: '#111111', fontSize: 24, fontWeight: '600', marginBottom: 20 },
  profileCard: { minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderWidth: 1, borderColor: '#E6E8EB', borderRadius: 16, marginBottom: 28 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#EEF0F3', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#667085', fontSize: 20, fontWeight: '600' },
  name: { color: '#111111', fontSize: 17, fontWeight: '600' },
  email: { color: '#7B8494', fontSize: 14, marginTop: 4 },
  sectionTitle: { color: '#111111', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  menuCard: { paddingHorizontal: 16, borderWidth: 1, borderColor: '#E6E8EB', borderRadius: 16 },
  menuRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center' },
  menuBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E1E4E8' },
  menuLabel: { flex: 1, color: '#303642', fontSize: 15 },
  chevron: { color: '#B5BBC3', fontSize: 26 },
});
