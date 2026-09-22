import React from "react";
import { View, FlatList } from "react-native";
import { ArrowUp, ArrowDown } from "lucide-react-native";
import { Screen, ScreenHeader, AppText, Card } from "../components/ui";
import { success, danger, ink } from "../theme/colors";
import { useMemberStore } from "../store/memberStore";

export default function PointsHistoryScreen() {
  const points = useMemberStore((s) => s.points);
  const history = useMemberStore((s) => s.history);

  return (
    <Screen>
      <ScreenHeader title="Riwayat Poin" />
      <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
        <View style={{ backgroundColor: "#123CA3", borderRadius: 20, padding: 20, flexDirection: "row", alignItems: "center", gap: 16 }}>
          <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center" }}>
            <ArrowUp size={22} color="#FFFFFF" />
          </View>
          <View>
            <AppText variant="caption" color="rgba(255,255,255,0.8)">Total Poin Anda</AppText>
            <AppText variant="h2" color="#FFFFFF">{points.toLocaleString("id-ID")} Poin</AppText>
          </View>
        </View>
      </View>

      <FlatList
        data={history}
        keyExtractor={(h) => h.id}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 40 }}
        ListHeaderComponent={<AppText variant="h3" style={{ marginBottom: 4 }}>Riwayat Transaksi Poin</AppText>}
        renderItem={({ item }) => {
          const earn = item.type === "earn";
          return (
            <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: earn ? success[50] : danger[50],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {earn ? <ArrowUp size={16} color={success[600]} /> : <ArrowDown size={16} color={danger[600]} />}
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="bodySemibold">{item.title}</AppText>
                <AppText variant="caption" color={ink[500]}>{item.date}</AppText>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <AppText variant="bodySemibold" color={earn ? success[600] : danger[600]}>
                  {earn ? "+" : ""}{item.points.toLocaleString("id-ID")} poin
                </AppText>
                <AppText variant="micro" color={ink[400]}>{earn ? "Diperoleh" : "Ditukar"}</AppText>
              </View>
            </Card>
          );
        }}
      />
    </Screen>
  );
}
