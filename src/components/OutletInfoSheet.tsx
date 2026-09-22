import React from "react";
import { ScrollView, View } from "react-native";
import { CircleCheck, CircleX, Clock, MapPin } from "lucide-react-native";
import { AppText } from "./ui/AppText";
import { BottomSheet } from "./ui/BottomSheet";
import { brand, danger, ink, success, surface } from "../theme/colors";
import type { Outlet, WeekDay } from "../data/types";

const days: { key: WeekDay; label: string }[] = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

/** Mock "today" so the highlighted row is stable across renders. */
const TODAY: WeekDay = "selasa";

/** Address, live open/closed banner and the full week of opening hours. */
export function OutletInfoSheet({ outlet, onClose }: { outlet: Outlet; onClose: () => void }) {
  return (
    <BottomSheet
      onClose={onClose}
      showHandle
      showClose={false}
      backgroundColor={surface}
      maxHeightRatio={0.82}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 24 }}
      >
        <AppText variant="h2">{outlet.name}</AppText>

        <View style={{ flexDirection: "row", gap: 12, marginTop: 22 }}>
          <MapPin size={20} color={danger[500]} fill={danger[500]} stroke="#FFFFFF" />
          <AppText variant="body" color={ink[500]} style={{ flex: 1, lineHeight: 23 }}>
            {outlet.addressFull}
          </AppText>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}>
          <Clock size={20} color={ink[400]} />
          <AppText variant="body" color={ink[500]}>
            Hari ini: {outlet.weeklyHours[TODAY]}
          </AppText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 20,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 14,
            backgroundColor: outlet.isOpen ? success[50] : danger[50],
          }}
        >
          {outlet.isOpen ? (
            <CircleCheck size={24} color={success[500]} fill={success[500]} stroke="#FFFFFF" />
          ) : (
            <CircleX size={24} color={danger[500]} fill={danger[500]} stroke="#FFFFFF" />
          )}
          <AppText variant="bodySemibold" color={outlet.isOpen ? success[600] : danger[500]}>
            {outlet.isOpen ? "Buka sekarang" : `Tutup, buka pukul ${outlet.opensAt}`}
          </AppText>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginTop: 10,
            borderRadius: 14,
            paddingVertical: 14,
            paddingHorizontal: 14,
            backgroundColor: outlet.appOrderAvailable ? "#EFF5F1" : ink[100],
          }}
        >
          {outlet.appOrderAvailable ? (
            <CircleCheck size={24} color={success[500]} fill={success[500]} stroke="#FFFFFF" />
          ) : (
            <CircleX size={24} color={ink[400]} fill={ink[400]} stroke="#FFFFFF" />
          )}
          <AppText
            variant="bodySemibold"
            color={outlet.appOrderAvailable ? success[600] : ink[500]}
          >
            {outlet.appOrderAvailable
              ? "Pemesanan via Good Will Grow tersedia"
              : "Pemesanan via aplikasi belum tersedia"}
          </AppText>
        </View>

        <AppText variant="h3" style={{ marginTop: 26, marginBottom: 6 }}>
          Jam Operasional
        </AppText>

        {days.map(({ key, label }) => {
          const today = key === TODAY;
          return (
            <View
              key={key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 9,
              }}
            >
              <AppText
                color={today ? brand[700] : ink[700]}
                style={{
                  flex: 1,
                  fontSize: 15,
                  lineHeight: 20,
                  fontFamily: today ? "Urbanist_700Bold" : "Urbanist_400Regular",
                }}
              >
                {label}
              </AppText>
              <AppText
                color={today ? brand[700] : ink[700]}
                style={{
                  fontSize: 15,
                  lineHeight: 20,
                  fontFamily: today ? "Urbanist_700Bold" : "Urbanist_400Regular",
                }}
              >
                {outlet.weeklyHours[key]}
              </AppText>
            </View>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}
