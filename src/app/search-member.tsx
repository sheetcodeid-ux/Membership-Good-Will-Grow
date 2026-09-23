import React, { useMemo, useState } from "react";
import { FlatList, Platform, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AppIcon } from "../components/ui/AppIcon";
import { AppHeader } from "../components/ui/AppHeader";
import { EmptyState } from "../components/ui/EmptyState";
import { UiText } from "../components/ui/Text";
import { PressableScale } from "../components/ui/PressableScale";
import { MemberRow } from "../components/MemberRow";
import { brand, ink, surface } from "../theme/colors";
import { HIT_SIZE, radius, space, type as typeScale } from "../theme/scale";
import { shadow } from "../theme/shadows";
import { useResponsive } from "../theme/responsive";
import { members } from "../data/mock";
import { useAuthStore } from "../store/authStore";

export default function SearchMemberScreen() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const r = useResponsive();
  const me = useAuthStore((s) => s.username);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter(
      (m) =>
        // You can't follow yourself, so keep your own card out of the results.
        m.username !== me &&
        (m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q))
    );
  }, [query, me]);

  const searching = query.trim().length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Cari Member" />

      <FlatList
        data={results}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{
          padding: r.gutter,
          paddingBottom: space.xxxl * 2,
          gap: space.md,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ gap: space.lg, marginBottom: space.xs }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: space.md,
                backgroundColor: "#FFFFFF",
                borderRadius: radius.lg,
                paddingHorizontal: space.lg,
                height: HIT_SIZE + space.xs,
                // The ring on focus is the only thing that tells you the
                // keyboard is pointed here; a white box on a white page does
                // not, and the caret alone is too small to catch.
                borderWidth: 1.5,
                borderColor: focused ? brand[300] : "transparent",
                ...(shadow.xs as object),
              }}
            >
              <AppIcon name="search" size={20} color={focused ? brand[600] : ink[400]} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Cari nama atau username..."
                placeholderTextColor={ink[300]}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
                style={[
                  {
                    flex: 1,
                    minWidth: 0,
                    padding: 0,
                    fontFamily: typeScale.body.fontFamily,
                    fontSize: typeScale.body.fontSize,
                    color: ink[900],
                  },
                  Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null,
                ]}
              />
              {searching ? (
                <PressableScale onPress={() => setQuery("")} rippleBorderless scaleTo={0.9}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: ink[200],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppIcon name="close" size={13} color={ink[600]} />
                  </View>
                </PressableScale>
              ) : null}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: space.sm }}>
              <UiText token="label" color={ink[500]}>
                {searching ? "HASIL PENCARIAN" : "SARAN UNTUK KAMU"}
              </UiText>
              <View style={{ flex: 1, height: 1, backgroundColor: ink[200] }} />
              <UiText token="label" color={ink[400]}>
                {results.length}
              </UiText>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(Math.min(index, 6) * 40).duration(260)}>
            <MemberRow member={item} actionLabel={undefined} />
          </Animated.View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={<AppIcon name="userOff" size={60} color={ink[300]} />}
            title="Member tidak ditemukan"
            subtitle={`Tidak ada yang cocok dengan "${query.trim()}". Coba kata kunci lain.`}
            style={{ paddingTop: space.xxxl * 2 }}
          />
        }
      />
    </View>
  );
}
