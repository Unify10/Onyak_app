import { useState } from 'react';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';

type Props = { uri: string; onRemove: () => void };

export default function SelectedImageCard({ uri, onRemove }: Props) {
  const styles = useResponsiveStyles(baseStyles);
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'error'>('loading');
  return (
    <View style={styles.card}>
      <View accessible accessibilityLabel="선택한 이미지" accessibilityState={{ busy: imageState === 'loading' }} style={styles.image}>
        {imageState === 'loading' && <SkeletonBlock style={StyleSheet.absoluteFill} />}
        {imageState !== 'error' && (
          <Image
            source={{ uri }}
            onLoad={() => setImageState('ready')}
            onError={() => setImageState('error')}
            style={[styles.thumbnail, imageState === 'loading' && styles.hidden]}
          />
        )}
      </View>
      <View style={styles.info}>
        <AppText style={styles.title}>
          {imageState === 'ready' ? '이미지를 준비했어요' : imageState === 'error' ? '이미지를 표시하지 못했어요' : '이미지를 불러오는 중이에요'}
        </AppText>
        <AppText style={styles.description}>글자 추출은 OCR 서비스 연결 후 이용할 수 있어요.</AppText>
        <Pressable onPress={onRemove} accessibilityRole="button"><AppText style={styles.remove}>이미지 삭제</AppText></Pressable>
      </View>
    </View>
  );
}

const baseStyles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F8FA', borderRadius: 15, padding: 12, marginTop: -12, marginBottom: 20 },
  image: { width: 70, height: 70, borderRadius: 11, overflow: 'hidden', backgroundColor: '#E5E7EB' },
  thumbnail: { width: '100%', height: '100%' },
  hidden: { opacity: 0 },
  info: { flex: 1, marginLeft: 13 },
  title: { color: '#171C26', fontSize: 18, fontWeight: '700' },
  description: { color: '#7E8795', fontSize: 15, lineHeight: 20, marginTop: 4 },
  remove: { color: '#39A887', fontSize: 15, marginTop: 5 },
});
