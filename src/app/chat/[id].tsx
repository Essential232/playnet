import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Message = { id: string; text: string; mine: boolean };

export default function ChatScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const theme = useTheme();
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'welcome', text: 'Hey! Want to play a quick game?', mine: false },
  ]);

  function sendMessage() {
    const cleanText = text.trim();
    if (!cleanText) return;
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}`, text: cleanText, mine: true },
    ]);
    setText('');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()}>
            <ThemedText type="smallBold">‹ Back</ThemedText>
          </Pressable>
          <ThemedText type="smallBold">{name ?? 'Chat'}</ThemedText>
          <Pressable
            accessibilityLabel="Invite to game"
            onPress={() => router.push('/game')}>
            <ThemedText type="linkPrimary">Game</ThemedText>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messages}
            renderItem={({ item }) => (
              <View style={[styles.bubbleRow, item.mine && styles.mineRow]}>
                <View
                  style={[
                    styles.bubble,
                    item.mine
                      ? { backgroundColor: '#3c87f7' }
                      : { backgroundColor: theme.backgroundElement },
                  ]}>
                  <ThemedText style={item.mine ? styles.mineText : undefined}>
                    {item.text}
                  </ThemedText>
                </View>
              </View>
            )}
          />
          <View style={[styles.composer, { backgroundColor: theme.background }]}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Message"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
              onSubmitEditing={sendMessage}
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <ThemedText style={styles.sendText}>Send</ThemedText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
  },
  messages: { paddingHorizontal: Spacing.four, paddingVertical: Spacing.three, gap: 8 },
  bubbleRow: { alignItems: 'flex-start' },
  mineRow: { alignItems: 'flex-end' },
  bubble: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  mineText: { color: '#ffffff' },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  input: { flex: 1, height: 48, borderRadius: 24, paddingHorizontal: 16 },
  sendButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3c87f7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sendText: { color: '#ffffff', fontWeight: '700' },
});
