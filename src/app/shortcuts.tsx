import React from "react";
import { ScrollView, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { PressableScale } from "../components/ui/PressableScale";
import { Glyph, type GlyphName } from "../components/icons/Glyph";
import {
  AccountCard,
  AccountSection,
  LABEL_INK,
  QUIET_INK,
  RULE,
} from "../components/AccountMenu";
import { brand, iconGrey, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import {
  availableShortcuts,
  requiredShortcuts,
  useShortcutStore,
  type ShortcutItem,
} from "../store/shortcutStore";

const EDGE = 13.5;
/** Row geometry shared with the profile's menu. */
const PAD_LEFT = 8.5;
const ICON_BOX = 21;
const LABEL_X = 39.5;

/**
 * The shortcut store names its marks; each maps to the glyph the profile
 * menu uses for the same page, so a shortcut looks like the row it opens.
 */
const glyphFor: Record<string, GlyphName> = {
  receipt: "receipt",
  ticket: "tag",
  star: "coins",
  gift: "ticket",
  "ticket-check": "ticketPercent",
  bell: "bell",
  bookmark: "bookmark",
  search: "search",
  users: "users",
  "user-plus": "userPlus",
  ban: "userOff",
  user: "tabProfile",
  pencil: "pencil",
  lock: "lock",
  settings: "settings",
  share: "share",
};

function Hint({ children }: { children: string }) {
  return (
    <UiText
      color={QUIET_INK}
      style={{
        marginTop: -4,
        marginBottom: 9,
        fontSize: 12.5,
        lineHeight: 17,
        fontFamily: fontFamilies.medium,
      }}
    >
      {children}
    </UiText>
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
      {divider ? (
        <View
          style={{
            height: 1,
            backgroundColor: RULE,
            marginLeft: LABEL_X,
            marginRight: 9.5,
          }}
        />
      ) : null}
      <View
        style={{
          minHeight: 58,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: PAD_LEFT,
          paddingRight: 12,
          paddingVertical: 9,
        }}
      >
        <View style={{ width: ICON_BOX, alignItems: "center" }}>
          <Glyph
            name={glyphFor[item.icon] ?? "star"}
            size={21}
            color={iconGrey}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: LABEL_X - PAD_LEFT - ICON_BOX,
            marginRight: 10,
          }}
        >
          <UiText
            color={LABEL_INK}
            numberOfLines={1}
            style={{
              fontSize: 15,
              lineHeight: 19,
              fontFamily: fontFamilies.semibold,
            }}
          >
            {item.label}
          </UiText>
          <UiText
            color={QUIET_INK}
            numberOfLines={1}
            style={{
              marginTop: 1,
              fontSize: 12.5,
              lineHeight: 16,
              fontFamily: fontFamilies.medium,
            }}
          >
            {item.description}
          </UiText>
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
      scaleTo={0.9}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: remove ? "#F2F3F5" : brand[600],
      }}
    >
      <Glyph
        name={remove ? "minus" : "plus"}
        size={14}
        color={remove ? QUIET_INK : "#FFFFFF"}
      />
    </PressableScale>
  );
}

function DefaultTag() {
  return (
    <View
      style={{
        backgroundColor: "#F2F3F5",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
      }}
    >
      <UiText
        color={QUIET_INK}
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontFamily: fontFamilies.semibold,
        }}
      >
        Bawaan
      </UiText>
    </View>
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
      <AppHeader tone="account" title="Atur Menu Pintas" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: EDGE, paddingBottom: 40 }}
      >
        <AccountSection title="Menu wajib" />
        <Hint>Selalu ada di pintasan dan tidak bisa dihapus.</Hint>
        <AccountCard>
          {requiredShortcuts.map((item, i) => (
            <Row
              key={item.id}
              item={item}
              divider={i > 0}
              right={<DefaultTag />}
            />
          ))}
        </AccountCard>

        <AccountSection title="Menu pintasmu" />
        <Hint>
          {mine.length === 0
            ? "Belum ada tambahan. Pilih dari daftar di bawah."
            : "Ketuk tombol minus untuk melepas pintasan."}
        </Hint>
        <AccountCard>
          {mine.length === 0 ? (
            <View
              style={{
                height: 58,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              <Glyph name="grid" size={16} color="#A0A4AE" />
              <UiText
                color="#A0A4AE"
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Belum ada pintasan tambahan
              </UiText>
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
        </AccountCard>

        {rest.length > 0 ? (
          <>
            <AccountSection title="Tambah menu pintas" />
            <Hint>Ketuk tombol plus untuk menambahkannya ke pintasan.</Hint>
            <AccountCard>
              {rest.map((item, i) => (
                <Row
                  key={item.id}
                  item={item}
                  divider={i > 0}
                  right={<RoundButton onPress={() => pin(item.id)} />}
                />
              ))}
            </AccountCard>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
