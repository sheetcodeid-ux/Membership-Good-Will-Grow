import React, { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { BottomSheet } from "./ui/BottomSheet";
import { UiText } from "./ui/Text";
import { PressableScale } from "./ui/PressableScale";
import { LABEL_INK, QUIET_INK } from "./AccountMenu";
import { brand } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { MONTHS, daysInMonth } from "../utils/dates";
import { tapSelect, tapSuccess } from "../utils/haptics";

const ROW = 44;
const VISIBLE = 5;

/**
 * One scrolling column of choices; the chosen one sits on a tinted pill
 * and the column opens scrolled to it.
 */
function Column({
  items,
  selected,
  onSelect,
  flex = 1,
}: {
  items: string[];
  selected: number;
  onSelect: (i: number) => void;
  flex?: number;
}) {
  const ref = useRef<ScrollView>(null);
  return (
    <View style={{ flex, height: ROW * VISIBLE }}>
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        onLayout={() =>
          ref.current?.scrollTo({
            y: Math.max(0, (selected - Math.floor(VISIBLE / 2)) * ROW),
            animated: false,
          })
        }
      >
        {items.map((label, i) => {
          const on = i === selected;
          return (
            <PressableScale
              key={label}
              scaleTo={0.97}
              onPress={() => {
                tapSelect();
                onSelect(i);
              }}
              style={{
                height: ROW - 4,
                marginVertical: 2,
                marginHorizontal: 4,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: on ? "#EEF3FF" : "transparent",
              }}
            >
              <UiText
                color={on ? brand[700] : LABEL_INK}
                style={{
                  fontSize: on ? 16 : 15,
                  lineHeight: 20,
                  fontFamily: on ? fontFamilies.bold : fontFamilies.medium,
                }}
              >
                {label}
              </UiText>
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

/**
 * Birth date picker: day, month and year side by side, so a date years
 * back is three taps rather than a calendar paged month by month.
 */
export function DatePickerSheet({
  initial,
  onClose,
  onPick,
}: {
  initial?: Date;
  onClose: () => void;
  onPick: (d: Date) => void;
}) {
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => thisYear - 10 - i);
  const start = initial ?? new Date(thisYear - 25, 0, 1);
  const [year, setYear] = useState(start.getFullYear());
  const [month, setMonth] = useState(start.getMonth());
  const [day, setDay] = useState(start.getDate());

  const maxDay = daysInMonth(year, month);
  const shownDay = Math.min(day, maxDay);
  const days = Array.from({ length: maxDay }, (_, i) => String(i + 1));

  return (
    <BottomSheet title="Tanggal lahir" onClose={onClose} maxHeightRatio={0.72}>
      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        <View style={{ flexDirection: "row", paddingBottom: 6 }}>
          {[
            ["Tanggal", 0.8],
            ["Bulan", 1.4],
            ["Tahun", 1],
          ].map(([label, f]) => (
            <UiText
              key={label as string}
              color={QUIET_INK}
              center
              style={{
                flex: f as number,
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.medium,
              }}
            >
              {label as string}
            </UiText>
          ))}
        </View>
        <View style={{ flexDirection: "row" }}>
          <Column
            flex={0.8}
            items={days}
            selected={shownDay - 1}
            onSelect={(i) => setDay(i + 1)}
          />
          <Column
            flex={1.4}
            items={MONTHS}
            selected={month}
            onSelect={setMonth}
          />
          <Column
            items={years.map(String)}
            selected={Math.max(0, years.indexOf(year))}
            onSelect={(i) => setYear(years[i])}
          />
        </View>
        <PressableScale
          scaleTo={0.98}
          onPress={() => {
            tapSuccess();
            onPick(new Date(year, month, shownDay));
          }}
          style={{
            marginTop: 14,
            marginBottom: 12,
            height: 48,
            borderRadius: 24,
            backgroundColor: brand[600],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UiText
            color="#FFFFFF"
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontFamily: fontFamilies.bold,
            }}
          >
            Pilih {shownDay} {MONTHS[month]} {year}
          </UiText>
        </PressableScale>
      </View>
    </BottomSheet>
  );
}
