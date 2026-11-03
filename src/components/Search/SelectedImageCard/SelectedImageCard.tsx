import { Image, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';

type Props = { uri: string; onRemove: () => void };

export default function SelectedImageCard({ uri, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri }} style={styles.image} />
      <View style={styles.info}>
        <AppText style={styles.title}>이미지를 준비했어요</AppText>
        <AppText style={styles.description}>글자 추출은 OCR 서비스 연결 후 이용할 수 있어요.</AppText>
        <Pressable onPress={onRemove} accessibilityRole="button"><AppText style={styles.remove}>이미지 삭제</AppText></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FA', borderRadius: 15, padding: 12, marginTop: -12, marginBottom: 20 },
  image: { width: 70, height: 70, borderRadius: 11, backgroundColor: '#E5E7EB' },
  info: { flex: 1, marginLeft: 13 },
  title: { color: '#171C26', fontSize: 18, fontWeight: '700' },
  description: { color: '#7E8795', fontSize: 15, lineHeight: 20, marginTop: 4 },
  remove: { color: '#39A887', fontSize: 15, marginTop: 5 },
});
