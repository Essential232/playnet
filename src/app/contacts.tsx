import * as Contacts from "expo-contacts";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/../lib/supabase";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ContactRow = { id: string; name: string; phone?: string; joined: boolean };

export default function ContactsScreen() {
  const theme = useTheme();
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function scanContacts() {
    setLoading(true);
    setMessage("");
    try {
      if (Platform.OS === "web") {
        setMessage("Contact scanning is available in the Android and iOS app.");
        return;
      }

      const permission = await Contacts.requestPermissionsAsync();
      if (permission.status !== "granted") {
        setMessage("Allow contacts access to find friends on Playnet.");
        return;
      }

      const result = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
        pageSize: 500,
      });
      const rows = result.data
        .map((contact) => ({
          id: contact.id,
          name: contact.name || "Unnamed contact",
          phone: contact.phoneNumbers?.[0]?.number,
        }))
        .filter((contact) => contact.phone);

      const phones = rows.map((contact) => contact.phone as string);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("phone")
        .in("phone", phones);
      const joinedPhones = new Set(
        (profiles ?? []).map((profile) => profile.phone),
      );

      setContacts(
        rows.map((contact) => ({
          ...contact,
          joined: joinedPhones.has(contact.phone),
        })),
      );
      setMessage(`${rows.length} contacts checked.`);
    } catch {
      setMessage(
        "Could not check contacts. You may need to add the profiles table in Supabase.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function invite() {
    await Share.share({
      message: "Join me on Playnet to chat and play games: playnet://",
    });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} accessibilityLabel="Go back">
            <ThemedText type="smallBold">‹ Back</ThemedText>
          </Pressable>
          <ThemedText type="subtitle">Invite contacts</ThemedText>
          <Pressable onPress={invite}>
            <ThemedText type="linkPrimary">Invite</ThemedText>
          </Pressable>
        </View>

        <Pressable
          disabled={loading}
          onPress={scanContacts}
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.pressed,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <ThemedText type="smallBold">Find contacts on Playnet</ThemedText>
          )}
        </Pressable>

        {message ? (
          <ThemedText themeColor="textSecondary" style={styles.message}>
            {message}
          </ThemedText>
        ) : null}

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.backgroundElement },
                ]}
              >
                <ThemedText type="smallBold">
                  {item.name.slice(0, 2).toUpperCase()}
                </ThemedText>
              </View>
              <View style={styles.copy}>
                <ThemedText type="smallBold">{item.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.phone}
                </ThemedText>
              </View>
              <Pressable
                onPress={item.joined ? () => router.push("/") : invite}
                style={[styles.action, item.joined && styles.joinedAction]}
              >
                <ThemedText
                  type="smallBold"
                  style={item.joined ? styles.joinedText : undefined}
                >
                  {item.joined ? "Chat" : "Invite"}
                </ThemedText>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scanButton: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75 },
  message: { marginTop: Spacing.two },
  list: { paddingTop: Spacing.three, paddingBottom: 40 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1, gap: 2 },
  action: {
    borderWidth: 1,
    borderColor: "#3c87f7",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  joinedAction: { backgroundColor: "#3c87f7" },
  joinedText: { color: "#ffffff" },
});
