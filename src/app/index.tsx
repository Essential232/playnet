import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccountMenu } from '@/components/account-menu';
import { useAuth } from '@/providers/auth-provider';
import { router } from 'expo-router';
import { useState } from 'react';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Conversation = {
  id: string;
  name: string;
  message: string;
  time: string;
  initials: string;
  unread?: number;
  online?: boolean;
};

const conversations: Conversation[] = [
  {
    id: 'maya',
    name: 'Maya Johnson',
    message: 'Want to play Connect 4 later?',
    time: '10:42 AM',
    initials: 'MJ',
    unread: 2,
    online: true,
  },
  {
    id: 'dev-team',
    name: 'Weekend Game Night',
    message: 'Alex shared a game invite',
    time: 'Yesterday',
    initials: 'WG',
    unread: 5,
  },
  {
    id: 'sam',
    name: 'Sam Wilson',
    message: 'Voice note · 0:18',
    time: 'Yesterday',
    initials: 'SW',
    online: true,
  },
  {
    id: 'riley',
    name: 'Riley Chen',
    message: 'The photos look great!',
    time: 'Mon',
    initials: 'RC',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const displayName =
    session?.user.user_metadata?.full_name ??
    session?.user.user_metadata?.name ??
    session?.user.email?.split('@')[0] ??
    'Player';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="Open account menu"
            onPress={() => setMenuVisible(true)}
            style={[styles.menuButton, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold">{displayName.slice(0, 2).toUpperCase()}</ThemedText>
          </Pressable>
          <View style={styles.headerCopy}>
            <ThemedText type="small" themeColor="textSecondary">
              Welcome, {displayName}
            </ThemedText>
            <ThemedText type="subtitle">Chats</ThemedText>
          </View>
          <Pressable
            accessibilityLabel="Start a new chat"
            style={[styles.newButton, { backgroundColor: '#3c87f7' }]}>
            <ThemedText style={styles.newButtonText}>+</ThemedText>
          </Pressable>
        </View>
        <AccountMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

        <View style={[styles.searchBox, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText themeColor="textSecondary">Search people and chats</ThemedText>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="smallBold">Recent</ThemedText>
          <Pressable accessibilityLabel="View all chats">
            <ThemedText type="linkPrimary">View all</ThemedText>
          </Pressable>
        </View>

        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Open chat with ${item.name}`}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id, name: item.name } })}
              style={({ pressed }) => [styles.conversation, pressed && styles.pressed]}>
              <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">{item.initials}</ThemedText>
                {item.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.conversationBody}>
                <View style={styles.conversationTopRow}>
                  <ThemedText type="smallBold" numberOfLines={1} style={styles.name}>
                    {item.name}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {item.time}
                  </ThemedText>
                </View>
                <View style={styles.conversationBottomRow}>
                  <ThemedText
                    numberOfLines={1}
                    themeColor="textSecondary"
                    style={styles.message}>
                    {item.message}
                  </ThemedText>
                  {item.unread ? (
                    <View style={styles.unread}>
                      <ThemedText type="smallBold" style={styles.unreadText}>
                        {item.unread}
                      </ThemedText>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
  },
  newButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
  searchBox: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: 14,
    marginBottom: Spacing.five,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  list: {
    paddingBottom: 120,
  },
  conversation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
  },
  pressed: {
    opacity: 0.65,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#35b86b',
  },
  conversationBody: {
    flex: 1,
    gap: Spacing.one,
  },
  conversationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flex: 1,
  },
  conversationBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  message: {
    flex: 1,
  },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3c87f7',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    lineHeight: 16,
  },
});
