import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function SupportScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ThemedText type="smallBold">‹ Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Contact support</ThemedText>
          <View style={{ width: 36 }} />
        </View>

        <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="smallBold">Need help?</ThemedText>
          <ThemedText themeColor="textSecondary">
            Tell us what happened and include the email used to sign in.
          </ThemedText>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => Linking.openURL('mailto:support@playnet.app?subject=Playnet%20support')}>
          <ThemedText style={styles.buttonText}>Email support</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { borderRadius: 16, padding: 16, gap: 8 },
  button: { height: 52, borderRadius: 14, backgroundColor: '#3c87f7', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
