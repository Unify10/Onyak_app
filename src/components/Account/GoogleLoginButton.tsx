import { useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import Text from '../Typography/Text';
import type { GoogleLoginButtonProps } from './googleLoginTypes';

export default function GoogleLoginButton({ disabled, onCredential, onError }: GoogleLoginButtonProps) {
  const [selecting, setSelecting] = useState(false);
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const isExpoGo = Constants.expoGoConfig != null;
  const missingSettings = !webClientId || (Platform.OS === 'ios' && (!iosClientId || !Constants.expoConfig?.ios?.bundleIdentifier))
    || (Platform.OS === 'android' && !Constants.expoConfig?.android?.package);
  const blocked = disabled || selecting || missingSettings || isExpoGo;

  async function selectAccount() {
    if (blocked) return;
    setSelecting(true);
    try {
      const { GoogleSignin, isSuccessResponse } = await import('@react-native-google-signin/google-signin');
      GoogleSignin.configure({ webClientId, iosClientId });
      if (Platform.OS === 'android') await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      if (!isSuccessResponse(result)) return;
      if (!result.data.idToken) throw new Error('구글에서 로그인 정보를 받지 못했어요.');
      await onCredential(result.data.idToken);
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : '구글 로그인에 실패했어요.');
    } finally {
      setSelecting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" accessibilityState={{ disabled: blocked, busy: selecting }} disabled={blocked} style={[styles.button, blocked && styles.disabled]} onPress={() => void selectAccount()}>
        <Image source={require('../../../assets/google-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text>{selecting ? '구글 계정 선택 중…' : '구글 계정으로 로그인'}</Text>
      </Pressable>
      {isExpoGo
        ? <Text style={styles.hint}>구글 로그인은 네이티브 개발 빌드에서 사용할 수 있어요.</Text>
        : missingSettings ? <Text style={styles.hint}>이 플랫폼의 구글 로그인 설정이 필요해요.</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 12, gap: 6 },
  button: { minHeight: 46, gap: 8, borderWidth: 1, borderRadius: 10, borderColor: '#DDDDDD', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  logo: { width: 20, height: 20 },
  disabled: { opacity: 0.5 },
  hint: { color: '#667085', fontSize: 13, textAlign: 'center' },
});
