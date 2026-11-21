import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/hooks/use-theme';

type AccountMenuProps = {
  visible: boolean;
  onClose: () => void;
};

export function AccountMenu({ visible, onClose }: AccountMenuProps) {
  const theme = useTheme();
  const { session, signOut } = useAuth();
  const name =
    session?.user.user_metadata?.full_name ??
    session?.user.user_metadata?.name ??
    session?.user.email?.split('@')[0] ??
    'Player';

  function navigate(path: '/' | '/contacts' | '/profile' | '/support') {
    onClose();
    router.push(path);
  }

  async function handleSignOut() {
    onClose();
    await signOut();
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          accessibilityLabel="Account menu"
          style={[styles.menu, { backgroundColor: theme.background }]}>
          <View style={styles.user}>
            <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="smallBold">
                {name.slice(0, 2).toUpper()}
              </ThemedText>
            </View>
            <View style={styles.userCopy}>
              <ThemedText type="smallBold" numberOfLines={1}>{name}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
                {session?.user.email}
              </ThemedText>
            </View>
          </View>

          <Pressable style={styles.item} onPress={() => navigate('/contacts')}>
            <ThemedText type="smallBold">Invite contacts</ThemedText>
          </Pressable>
          <Pressable style={styles.item} onPress={() => navigate('/profile')}>
            <ThemedText type="smallBold">Edit profile</ThemedText>
          </Pressable>
          <Pressable style={styles.item} onPress={() => navigate('/support')}>
            <ThemedText type="smallBold">Contact support</ThemedText>
          </Pressable>
          <Pressable style={styles.item} onPress={handleSignOut}>
            <ThemedText type="smallBold" style={styles.signOut}>Sign out</ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  menu: {
    width: 280,
    maxWidth: '86%',
    marginTop: 72,
    marginLeft: 16,
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCopy: { flex: 1, gap: 2 },
  item: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  signOut: { color: '#c93737' },
});
