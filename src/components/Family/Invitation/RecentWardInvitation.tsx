import { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { WardInvitation } from '../../../api/wardAuth';
import CreateFamilyScreen from '../../../screens/Family/CreateFamily/CreateFamilyScreen';
import Text from '../../Typography/Text';

type Props = { invitation: WardInvitation };

export default function RecentWardInvitation({ invitation }: Props) {
  const [visible, setVisible] = useState(false);
  const [expired, setExpired] = useState(false);

  function openInvitation() {
    if (Date.now() >= invitation.expiresAt) {
      setExpired(true);
      return;
    }
    setVisible(true);
  }

  function closeInvitation() {
    setVisible(false);
    setExpired(Date.now() >= invitation.expiresAt);
  }

  return (
    <>
      <Pressable accessibilityRole="button" style={styles.button} onPress={openInvitation} disabled={expired}>
        <Text style={styles.label}>{expired ? '연동 코드가 만료되었어요' : '발급된 연동 코드 다시 보기'}</Text>
      </Pressable>
      {visible && (
        <Modal visible onRequestClose={closeInvitation}>
          <SafeAreaView style={styles.screen}>
            <CreateFamilyScreen invitation={invitation} onBack={closeInvitation} onComplete={closeInvitation} />
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, marginTop: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  label: { color: '#344054', fontSize: 15 },
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
});
