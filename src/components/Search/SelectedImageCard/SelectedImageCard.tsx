import type { DrugImageAction } from '../../../api/drugs';
import { useState } from 'react';
import { useResponsiveStyles } from '../../../hooks/useResponsiveStyles';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import AppText from '../AppText/AppText';
import SkeletonBlock from '../../Skeleton/SkeletonBlock';

type Props = { uri: string; busy: boolean; onRemove: () => void; onRun: (action: DrugImageAction) => void };

export default function SelectedImageCard({ uri, busy, onRemove, onRun }: Props) {
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
        <View style={styles.actions}>
          <Pressable onPress={() => onRun('ocr')} disabled={busy} style={styles.action} accessibilityRole="button"><AppText>약 이름 찾기</AppText></Pressable>
          <Pressable onPress={() => onRun('analyze')} disabled={busy} style={styles.action} accessibilityRole="button"><AppText>사진 분석</AppText></Pressable>
        </View>
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
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  action: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: '#D6DAE0', borderRadius: 10, paddingHorizontal: 10 },
  remove: { color: '#39A887', fontSize: 15, marginTop: 5 },
});
