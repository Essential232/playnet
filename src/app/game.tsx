import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Cell = 'X' | 'O' | null;

function winner(board: Cell[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  return lines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c])?.map((index) => board[index])[0];
}

export default function GameScreen() {
  const theme = useTheme();
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [mode, setMode] = useState<'bot' | 'friend'>('bot');
  const [turn, setTurn] = useState<'X' | 'O'>('X');

  const result = useMemo(() => {
    const won = winner(board);
    if (won) return `${won} wins`;
    if (board.every(Boolean)) return 'Draw';
    return null;
  }, [board]);

  function botMove(nextBoard: Cell[]) {
    const empty = nextBoard.map((cell, index) => (cell ? -1 : index)).filter((index) => index >= 0);
    if (!empty.length) return;
    const index = empty[Math.floor(Math.random() * empty.length)];
    const botBoard = [...nextBoard];
    botBoard[index] = 'O';
    setBoard(botBoard);
  }

  function play(index: number) {
    if (board[index] || result) return;
    if (mode === 'friend' && turn === 'O') {
      const next = [...board];
      next[index] = 'O';
      setBoard(next);
      setTurn('X');
      return;
    }

    const next = [...board];
    next[index] = 'X';
    setBoard(next);
    if (mode === 'bot' && !winner(next) && next.some((cell) => !cell)) {
      setTimeout(() => botMove(next), 350);
    } else if (mode === 'friend') {
      setTurn('O');
    }
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setTurn('X');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><ThemedText type="smallBold">‹ Back</ThemedText></Pressable>
          <ThemedText type="subtitle">Tic-Tac-Toe</ThemedText>
          <Pressable onPress={reset}><ThemedText type="linkPrimary">Reset</ThemedText></Pressable>
        </View>

        <View style={[styles.modeRow, { backgroundColor: theme.backgroundElement }]}>
          <Pressable
            onPress={() => { setMode('bot'); reset(); }}
            style={[styles.modeButton, mode === 'bot' && styles.activeMode]}>
            <ThemedText type="smallBold" style={mode === 'bot' ? styles.activeText : undefined}>Play bot</ThemedText>
          </Pressable>
          <Pressable
            onPress={() => { setMode('friend'); reset(); }}
            style={[styles.modeButton, mode === 'friend' && styles.activeMode]}>
            <ThemedText type="smallBold" style={mode === 'friend' ? styles.activeText : undefined}>Two players</ThemedText>
          </Pressable>
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.status}>
          {result ? result : mode === 'bot' ? 'You are X · Bot is O' : `Turn: ${turn}`}
        </ThemedText>

        <View style={styles.board}>
          {board.map((cell, index) => (
            <Pressable
              key={index}
              onPress={() => play(index)}
              style={[styles.cell, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="title" style={cell === 'X' ? styles.x : styles.o}>
                {cell ?? ''}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  header: { minHeight: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modeRow: { height: 52, borderRadius: 26, padding: 4, flexDirection: 'row' },
  modeButton: { flex: 1, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  activeMode: { backgroundColor: '#3c87f7' },
  activeText: { color: '#ffffff' },
  status: { textAlign: 'center', marginVertical: 20 },
  board: { aspectRatio: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: '31%', height: '31%', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  x: { color: '#3c87f7' },
  o: { color: '#c93737' },
});
