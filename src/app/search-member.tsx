import React, { useState } from "react";
import { FlatList, Platform, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Search, UserX } from "lucide-react-native";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { MemberRow } from "../components/MemberRow";
import { ink, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { members } from "../data/mock";
import { useAuthStore } from "../store/authStore";

export default function SearchMemberScreen() {
  const [query, setQuery] = useState("");
  const me = useAuthStore((s) => s.username);

  const results = members.filter(
    (m) =>
      // You can't follow yourself, so keep your own card out of the results.
      m.username !== me &&
      (m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.username.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Search Member" />

      <FlatList
        data={results}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingHorizontal: 16,
              height: 54,
              marginBottom: 6,
            }}
          >
            <Search size={20} color={ink[400]} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search members..."
              placeholderTextColor={ink[300]}
              style={[
                {
                  flex: 1,
                  minWidth: 0,
                  padding: 0,
                  fontFamily: fontFamilies.regular,
                  fontSize: 15.5,
                  color: ink[900],
                },
                Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
              ]}
            />
          </View>
        }
        renderItem={({ item }) => <MemberRow member={item} actionLabel={undefined} />}
        ListEmptyComponent={
          <EmptyState
            icon={<UserX size={54} color={ink[300]} strokeWidth={1.8} />}
            title="Member tidak ditemukan"
            subtitle="Coba kata kunci lain."
            style={{ paddingTop: 60 }}
          />
        }
      />
    </View>
  );
}
