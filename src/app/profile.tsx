import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/providers/auth-provider';
import { supabase } from '@/../lib/supabase';

export default function ProfileScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const initialName =
    session?.user.user_metadata?.full_name ??
    session?.user.user_metadata?.name ??
    '';
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  async function saveProfile() {
    if (!session) return;
    setMessage('');
    const { error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      display_name: name.trim(),
      phone: phone.trim() || null,
      email: session.user.email,
    });
    if (error) {
      setMessage('Could not save profile. Run the Supabase setup migration first.');
      return;
    }
    await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setMessage('Profile saved.');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ThemedText type="smallBold">‹ Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Edit profile</ThemedText>
          <View style={{ width: 36 }} />
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Display name"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone number"
          keyboardType="phone-pad"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        />
        {message ? <ThemedText themeColor="textSecondary">{message}</ThemedText> : null}
        <Pressable onPress={saveProfile} style={styles.button}>
          <ThemedText style={styles.buttonText}>Save profile</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  input: { height: 52, borderRadius: 14, paddingHorizontal: 16, marginBottom: 12 },
  button: { height: 52, borderRadius: 14, backgroundColor: '#3c87f7', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
