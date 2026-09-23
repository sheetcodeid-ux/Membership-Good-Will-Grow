import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Minus, Plus } from "lucide-react-native";
import { AppText } from "../components/ui/AppText";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { ShortcutIcon } from "../components/ShortcutIcon";
import { brand, ink, surface } from "../theme/colors";
import { shadow } from "../theme/shadows";
import {
  availableShortcuts,
  requiredShortcuts,
  useShortcutStore,
  type ShortcutItem,
} from "../store/shortcutStore";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        paddingHorizontal: 14,
        ...(shadow.xs as object),
      }}
    >
      {children}
    </View>
  );
}

function Row({
  item,
  right,
  divider,
}: {
  item: ShortcutItem;
  right: React.ReactNode;
  divider: boolean;
}) {
  return (
    <View>
      {divider ? <View style={{ height: 1, backgroundColor: ink[100] }} /> : null}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 13 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            backgroundColor: brand[50],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShortcutIcon name={item.icon} size={19} />
        </View>
        <View style={{ flex: 1, gap: 1 }}>
          <AppText variant="h3" numberOfLines={1}>
            {item.label}
          </AppText>
          <AppText variant="caption" color={ink[500]} numberOfLines={1}>
            {item.description}
          </AppText>
        </View>
        {right}
      </View>
    </View>
  );
}

function RoundButton({
  onPress,
  remove,
}: {
  onPress: () => void;
  remove?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      hitSlop={10}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: remove ? ink[200] : brand[900],
      }}
    >
      {remove ? (
        <Minus size={16} color={ink[700]} strokeWidth={2.6} />
      ) : (
        <Plus size={16} color="#FFFFFF" strokeWidth={2.6} />
      )}
    </PressableScale>
  );
}

export default function ShortcutsScreen() {
  const pinned = useShortcutStore((s) => s.pinned);
  const pin = useShortcutStore((s) => s.pin);
  const unpin = useShortcutStore((s) => s.unpin);

  const mine = pinned
    .map((id) => availableShortcuts.find((s) => s.id === id))
    .filter((s): s is ShortcutItem => !!s);
  const rest = availableShortcuts.filter((s) => !pinned.includes(s.id));

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      <AppHeader title="Atur Menu Pintas" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 34, gap: 22 }}
      >
        <View style={{ gap: 10 }}>
          <View style={{ gap: 3 }}>
            <AppText variant="h3">Menu Wajib</AppText>
            <AppText variant="caption" color={ink[500]}>
              Menu di bawah ini selalu tersedia di pintasan dan tidak bisa dihapus.
            </AppText>
          </View>
          <Card>
            {requiredShortcuts.map((item, i) => (
              <Row
                key={item.id}
                item={item}
                divider={i > 0}
                right={
                  <View
                    style={{
                      backgroundColor: brand[50],
                      borderRadius: 9,
                      paddingHorizontal: 11,
                      paddingVertical: 6,
                    }}
                  >
                    <AppText variant="caption" color={brand[700]}>
                      Default
                    </AppText>
                  </View>
                }
              />
            ))}
          </Card>
        </View>

        <View style={{ gap: 10 }}>
          <View style={{ gap: 3 }}>
            <AppText variant="h3">Menu Pintasmu</AppText>
            <AppText variant="caption" color={ink[500]}>
              {mine.length === 0
                ? "Belum ada menu pintas tambahan. Pilih dari daftar di bawah untuk menambahkan."
                : "Tekan tombol minus untuk melepas pintasan."}
            </AppText>
          </View>
          <Card>
            {mine.length === 0 ? (
              <View style={{ paddingVertical: 26, alignItems: "center" }}>
                <AppText variant="body" color={ink[400]}>
                  Belum ada pintasan tambahan
                </AppText>
              </View>
            ) : (
              mine.map((item, i) => (
                <Row
                  key={item.id}
                  item={item}
                  divider={i > 0}
                  right={<RoundButton remove onPress={() => unpin(item.id)} />}
                />
              ))
            )}
          </Card>
        </View>

        {rest.length > 0 ? (
          <View style={{ gap: 10 }}>
            <View style={{ gap: 3 }}>
              <AppText variant="h3">Tambah Menu Pintas</AppText>
              <AppText variant="caption" color={ink[500]}>
                Pilih menu untuk ditambahkan ke pintasan kamu.
              </AppText>
            </View>
            <Card>
              {rest.map((item, i) => (
                <Row
                  key={item.id}
                  item={item}
                  divider={i > 0}
                  right={<RoundButton onPress={() => pin(item.id)} />}
                />
              ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
