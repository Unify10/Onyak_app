import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
} from 'expo-camera';

type Props = {
  onPressBack?: () => void;
  onComplete?: () => void;
  onSubmitQr?: (
    qrData: string,
  ) => Promise<{ success: boolean; userName?: string }>;
};

export default function QRLoginScreen({
  onPressBack,
  onComplete,
  onSubmitQr,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scanError, setScanError] = useState('');
  const [userName, setUserName] = useState('');
  const scanLocked = useRef(false);

  async function handleBarcodeScanned(result: BarcodeScanningResult) {
    // 같은 QR 코드가 연속으로 처리되지 않도록 잠급니다.
    if (scanLocked.current || !isScanning) return;

    scanLocked.current = true;
    setIsScanning(false);
    setScanError('');

    if (!onSubmitQr) {
      setScanError('QR 인증 기능을 서버와 연결해주세요.');
      setIsScanning(true);
      scanLocked.current = false;
      return;
    }

    try {
      setIsLoading(true);
      const response = await onSubmitQr(result.data);

      if (response.success) {
        setUserName(response.userName ?? '');
      } else {
        setScanError('유효하지 않은 QR 코드입니다. 다시 스캔해주세요.');
        setIsScanning(true);
        scanLocked.current = false;
      }
    } catch {
      setScanError('QR 인증 중 문제가 발생했습니다. 다시 스캔해주세요.');
      setIsScanning(true);
      scanLocked.current = false;
    } finally {
      setIsLoading(false);
    }
  }

  // 카메라 권한 정보를 불러오는 중입니다.
  if (!permission) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#6686A5" />
        </View>
      </SafeAreaView>
    );
  }

  // 로그인 완료 화면
  if (userName || (!isScanning && !scanError && !isLoading)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.completeScreen}>
          <View style={styles.completeHeader}>
            <Pressable style={styles.backButton} onPress={onPressBack}>
              <Text style={styles.backButtonText}>‹</Text>
            </Pressable>
            <Text style={styles.headerTitle}>로그인 완료</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.progressRow}>
            <View style={styles.progressShort} />
            <View style={styles.progressShort} />
            <View style={styles.progressShort} />
            <View style={styles.progressLong} />
          </View>

          <View style={styles.completeContent}>
            <Text style={styles.partyEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>
              {userName ? `${userName}님의\n연동 로그인이` : '연동 로그인이'}
              {'\n'}완료되었습니다.
            </Text>
          </View>

          <View style={styles.completeBottom}>
            <Pressable style={styles.nextButton} onPress={onComplete}>
              <Text style={styles.nextButtonText}>다음</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 카메라 권한이 없으면 권한을 요청합니다.
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.permissionScreen}>
          <Pressable style={styles.backButton} onPress={onPressBack}>
            <Text style={styles.backButtonText}>‹</Text>
          </Pressable>

          <View style={styles.permissionMessage}>
            <Text style={styles.title}>QR 코드를 스캔하려면</Text>
            <Text style={styles.description}>
              카메라 접근 권한이 필요합니다.
            </Text>

            <Pressable style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>카메라 권한 허용</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.scanScreen}>
        <Pressable style={styles.backButton} onPress={onPressBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        {/* 서비스 로고와 설명 */}
        <View style={styles.brand}>
          <Image
            source={require('../../../assets/onyak-logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>약물 상호작용 확인 서비스</Text>
        </View>

        <Text style={styles.scanTitle}>QR 코드 스캔</Text>
        <Text style={styles.scanDescription}>
          보호자 계정에 표시된 QR 코드를 화면 안에 맞춰주세요.
        </Text>

        {/* 카메라 미리보기와 스캔 영역 */}
        <View style={styles.cameraFrame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
          />

          <View pointerEvents="none" style={styles.cornerOverlay}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {isLoading && (
          <View style={styles.loadingMessage}>
            <ActivityIndicator color="#6686A5" />
            <Text style={styles.loadingText}>QR 코드를 확인하고 있어요.</Text>
          </View>
        )}

        {scanError !== '' && <Text style={styles.errorText}>{scanError}</Text>}
      </View>
    </SafeAreaView>
  );
}

const CORNER_SIZE = 42;
const CORNER_WIDTH = 7;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scanScreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#D9DDE2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    marginTop: -3,
    color: '#111111',
    fontSize: 29,
    lineHeight: 32,
  },
  brand: {
    alignItems: 'center',
    marginTop: 28,
  },
  logoMark: {
    color: '#6686A5',
    fontSize: 38,
    fontWeight: '700',
  },
  logoName: {
    marginTop: -7,
    color: '#6686A5',
    fontSize: 15,
  },
  subtitle: {
    marginTop: 38,
    color: '#727C8B',
    fontSize: 17,
  },
  scanTitle: {
    marginTop: 118,
    marginLeft: 20,
    color: '#111111',
    fontSize: 18,
    fontWeight: '500',
  },
  scanDescription: {
    marginTop: 8,
    marginHorizontal: 20,
    color: '#777777',
    fontSize: 12,
  },
  cameraFrame: {
    width: '100%',
    aspectRatio: 1,
    maxHeight: 340,
    marginTop: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  cornerOverlay: {
  ...StyleSheet.absoluteFill,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#858585',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderTopLeftRadius: 18,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderTopRightRadius: 18,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderBottomLeftRadius: 18,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
    borderRightWidth: CORNER_WIDTH,
    borderBottomWidth: CORNER_WIDTH,
    borderBottomRightRadius: 18,
  },
  loadingMessage: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#555555',
    fontSize: 13,
  },
  errorText: {
    marginTop: 14,
    color: '#E5484D',
    fontSize: 12,
    textAlign: 'center',
  },
  permissionScreen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  permissionMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#222222',
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    marginTop: 10,
    color: '#777777',
    fontSize: 14,
  },
  permissionButton: {
    minHeight: 48,
    marginTop: 24,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completeScreen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  completeHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DDDDDD',
  },
  headerTitle: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 40,
  },
  progressRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 6,
  },
  progressShort: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  progressLong: {
    height: 5,
    flex: 1,
    borderRadius: 3,
    backgroundColor: '#000000',
  },
  completeContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 50,
  },
  partyEmoji: {
    marginBottom: 28,
    fontSize: 112,
    textAlign: 'center',
  },
  completeTitle: {
    color: '#000000',
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 52,
  },
  completeBottom: {
    paddingHorizontal: 12,
    paddingBottom: 44,
  },
  nextButton: {
    height: 64,
    borderRadius: 14,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },

    logoImage: {
    width: 64,
    height: 64,
  },
});