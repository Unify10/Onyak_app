import { useRef } from 'react';
import { Alert, Modal, Pressable, StyleSheet, View } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

type Props = { visible: boolean; onClose: () => void; onPickImage: () => void; onImageCaptured: (uri: string) => void };

export default function LabelCameraModal({ visible, onClose, onPickImage, onImageCaptured }: Props) {
  const cameraRef = useRef<CameraView>(null);

  async function capturePhoto() {
    try {
      const picture = await cameraRef.current?.takePictureAsync({ quality: 0.9 });
      if (picture?.uri) onImageCaptured(picture.uri);
    } catch {
      Alert.alert('촬영하지 못했어요', '카메라를 확인한 뒤 다시 시도해 주세요.');
    }
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.close} onPress={onClose} accessibilityRole="button" accessibilityLabel="카메라 닫기">
            <Ionicons name="close" size={27} color="#FFFFFF" />
          </Pressable>
          <AppText style={styles.title}>처방전·약품 라벨 촬영</AppText>
          <View style={styles.closePlaceholder} />
        </View>
        <View style={styles.preview}>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />
          <View pointerEvents="none" style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <AppText style={styles.hint}>약품명과 글자가 잘 보이도록 맞춰 주세요</AppText>
        </View>
        <View style={styles.controls}>
          <Pressable style={styles.sideButton} onPress={onPickImage} accessibilityRole="button" accessibilityLabel="갤러리에서 선택">
            <Ionicons name="images-outline" size={28} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.shutter} onPress={capturePhoto} accessibilityRole="button" accessibilityLabel="사진 촬영">
            <View style={styles.shutterInner} />
          </Pressable>
          <View style={styles.sideButton} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#080B10' },
  header: { height: 100, paddingTop: 38, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 42, height: 42, alignItems: 'flex-start', justifyContent: 'center' },
  closePlaceholder: { width: 42 },
  title: { color: '#FFFFFF', fontSize: 19, fontWeight: '600', textAlign: 'center' },
  preview: { flex: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  frame: { width: '81%', height: '48%', position: 'absolute' },
  corner: { width: 42, height: 42, position: 'absolute', borderColor: '#FFFFFF' },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 13 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 13 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 13 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 13 },
  hint: { position: 'absolute', bottom: 34, color: '#FFFFFF', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
  controls: { height: 168, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: 28 },
  sideButton: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFFFFF' },
});
