import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from '@/hooks/use-theme';

export function AuthScreen() {
  const theme = useTheme();
  const { error, signIn, signInWithGoogle, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim() || password.length < 6) {
      setMessage('Enter an email and a password with at least 6 characters.');
      return;
    }

    setMessage(null);
    setIsSubmitting(true);
    try {
      const hasSession = isSigningUp
        ? await signUp(email.trim(), password)
        : (await signIn(email.trim(), password), true);
      if (isSigningUp && !hasSession) {
        setMessage('Check your email to confirm your account, then sign in.');
      }
    } catch {
      // The provider exposes the Supabase error for the form.
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // The provider exposes the Supabase error for the form.
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Chat, play, and stay connected
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Welcome to Playnet
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.intro}>
            Sign in to your conversations and games.
          </ThemedText>

          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            value={email}
          />
          <TextInput
            autoCapitalize="none"
            autoComplete="password"
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            secureTextEntry
            style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
            value={password}
          />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            disabled={isSubmitting || isGoogleSubmitting}
            onPress={handleGoogleSignIn}
            style={({ pressed }) => [styles.googleButton, pressed && styles.pressed]}>
            {isGoogleSubmitting ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <ThemedText style={styles.googleButtonText}>Continue with Google</ThemedText>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
            <ThemedText type="small" themeColor="textSecondary">
              or use email
            </ThemedText>
            <View style={[styles.dividerLine, { backgroundColor: theme.backgroundSelected }]} />
          </View>

          {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
          {message ? (
            <ThemedText themeColor="textSecondary" style={styles.message}>
              {message}
            </ThemedText>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSigningUp ? 'Create account' : 'Sign in'}
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText style={styles.primaryButtonText}>
                {isSigningUp ? 'Create account' : 'Sign in'}
              </ThemedText>
            )}
          </Pressable>

          <Pressable onPress={() => setIsSigningUp((current) => !current)} style={styles.toggle}>
            <ThemedText type="linkPrimary">
              {isSigningUp ? 'Already have an account? Sign in' : 'New here? Create an account'}
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  content: { flex: 1, justifyContent: 'center' },
  title: { marginTop: Spacing.two, marginBottom: Spacing.two },
  intro: { marginBottom: Spacing.five },
  input: {
    borderRadius: 14,
    fontSize: 16,
    minHeight: 52,
    marginBottom: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  error: { color: '#c93737', marginBottom: Spacing.two },
  message: { marginBottom: Spacing.two },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#3c87f7',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: Spacing.two,
  },
  primaryButtonText: { color: '#ffffff', fontWeight: '700' },
  googleButton: {
    alignItems: 'center',
    borderColor: '#d8dce5',
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: Spacing.two,
  },
  googleButtonText: { fontWeight: '700' },
  divider: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two,
    marginVertical: Spacing.three,
  },
  dividerLine: { flex: 1, height: 1 },
  pressed: { opacity: 0.75 },
  toggle: { alignItems: 'center', marginTop: Spacing.three },
});
