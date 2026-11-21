import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { router } from 'expo-router';

const games = [
  { title: 'Connect 4', detail: '2 players · Strategy', color: '#f4b740' },
  { title: 'Tic-Tac-Toe', detail: '2 players · Quick match', color: '#65b6a1' },
  { title: 'Word Guess', detail: '2–8 players · Party', color: '#b187e8' },
];

const friends = [
  { name: 'Maya Johnson', username: '@mayaj', initials: 'MJ', online: true },
  { name: 'Sam Wilson', username: '@samwilson', initials: 'SW', online: true },
  { name: 'Riley Chen', username: '@rileychen', initials: 'RC', online: false },
];

export default function ExploreScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ThemedText type="small" themeColor="textSecondary">
            Discover something new
          </ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            Explore
          </ThemedText>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Play together</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Mini-games
            </ThemedText>
          </View>

          {games.map((game) => (
            <Pressable
              key={game.title}
              accessibilityLabel={`Play ${game.title}`}
              onPress={() => router.push('/game')}
              style={({ pressed }) => [
                styles.gameCard,
                { backgroundColor: game.color },
                pressed && styles.pressed,
              ]}>
              <View style={styles.gameCardCopy}>
                <ThemedText type="subtitle" style={styles.gameTitle}>
                  {game.title}
                </ThemedText>
                <ThemedText style={styles.gameDetail}>{game.detail}</ThemedText>
              </View>
              <View style={styles.playButton}>
                <ThemedText style={styles.playButtonText}>Play</ThemedText>
              </View>
            </Pressable>
          ))}

          <View style={[styles.inviteCard, { backgroundColor: theme.backgroundElement }]}>
            <View style={styles.inviteCopy}>
              <ThemedText type="smallBold">Invite a friend</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Share your username or QR code to connect.
              </ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Share your profile"
              onPress={() => Share.share({ message: 'Join me on Playnet: playnet://' })}>
              <ThemedText type="linkPrimary">Share</ThemedText>
            </Pressable>
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">People you may know</ThemedText>
            <ThemedText type="linkPrimary">Find friends</ThemedText>
          </View>

          {friends.map((friend) => (
            <View key={friend.username} style={styles.friendRow}>
              <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">{friend.initials}</ThemedText>
                {friend.online && <View style={styles.onlineDot} />}
              </View>
              <View style={styles.friendCopy}>
                <ThemedText type="smallBold">{friend.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {friend.username}
                </ThemedText>
              </View>
              <Pressable
                accessibilityLabel={`Add ${friend.name}`}
                style={styles.addButton}>
                <ThemedText type="smallBold" style={styles.addButtonText}>
                  Add
                </ThemedText>
              </Pressable>
            </View>
          ))}
        </ScrollView>
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
  content: {
    paddingTop: Spacing.two,
    paddingBottom: 120,
  },
  title: {
    marginBottom: Spacing.five,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  gameCard: {
    minHeight: 132,
    borderRadius: 20,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.75,
  },
  gameCardCopy: {
    gap: Spacing.one,
  },
  gameTitle: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 30,
  },
  gameDetail: {
    color: '#ffffff',
  },
  playButton: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  playButtonText: {
    color: '#1b1b1b',
    fontWeight: '700',
  },
  inviteCard: {
    borderRadius: 16,
    padding: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  inviteCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    right: -1,
    bottom: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: '#35b86b',
  },
  friendCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#3c87f7',
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  addButtonText: {
    color: '#3c87f7',
  },
});
