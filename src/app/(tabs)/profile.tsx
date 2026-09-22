import React from "react";
import { View, ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ShoppingBag,
  Ticket,
  Bell,
  Settings,
  Info,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
} from "lucide-react-native";
import { AppText, Card, Divider } from "../../components/ui";
import { Avatar } from "../../components/ui/Avatar";
import { PressableScale } from "../../components/ui/PressableScale";
import { MenuRow } from "../../components/MenuRow";
import { brand, ink, gold } from "../../theme/colors";
import { useAuthStore } from "../../store/authStore";
import { useMemberStore } from "../../store/memberStore";

export default function ProfileScreen() {
  const name = useAuthStore((s) => s.name);
  const phone = useAuthStore((s) => s.phone);
  const logout = useAuthStore((s) => s.logout);
  const tier = useMemberStore((s) => s.currentTier());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 130 }}>
        <AppText variant="h2">Profil</AppText>

        <PressableScale onPress={() => router.push("/edit-profile")}>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            <Avatar name={name} size={56} />
            <View style={{ flex: 1 }}>
              <AppText variant="titleLg">{name}</AppText>
              <AppText variant="caption" color={ink[500]}>
                +62{phone || "812xxxxxxxx"}
              </AppText>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Crown size={12} color={gold[600]} />
                <AppText variant="micro" color={gold[700]}>{tier.name} Member</AppText>
              </View>
            </View>
            <ChevronRight size={18} color={ink[300]} />
          </Card>
        </PressableScale>

        <View>
          <Card style={{ paddingVertical: 4 }}>
            <MenuRow
              icon={<ShoppingBag size={18} color={brand[600]} />}
              label="Riwayat Pesanan"
              onPress={() => router.push("/order-history")}
            />
            <Divider inset={54} />
            <MenuRow
              icon={<Ticket size={18} color={brand[600]} />}
              label="Voucher & Promo Saya"
              onPress={() => router.push("/promo")}
            />
            <Divider inset={54} />
            <MenuRow
              icon={<Bell size={18} color={brand[600]} />}
              label="Notifikasi"
              onPress={() => router.push("/notifications")}
            />
          </Card>
        </View>

        <View>
          <Card style={{ paddingVertical: 4 }}>
            <MenuRow
              icon={<Settings size={18} color={brand[600]} />}
              label="Pengaturan"
              onPress={() => router.push("/settings")}
            />
            <Divider inset={54} />
            <MenuRow
              icon={<Info size={18} color={brand[600]} />}
              label="Tentang Good Will Grow"
              onPress={() => router.push("/about")}
            />
            <Divider inset={54} />
            <MenuRow
              icon={<FileText size={18} color={brand[600]} />}
              label="Syarat & Ketentuan"
              onPress={() => router.push("/terms")}
            />
            <Divider inset={54} />
            <MenuRow icon={<HelpCircle size={18} color={brand[600]} />} label="Pusat Bantuan" />
          </Card>
        </View>

        <Card style={{ paddingVertical: 4 }}>
          <MenuRow
            icon={<LogOut size={18} color="#C21A40" />}
            label="Keluar Akun"
            danger
            onPress={() => {
              logout();
              router.replace("/");
            }}
          />
        </Card>

        <AppText variant="caption" color={ink[300]} center>
          Good Will Grow v1.0.0
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
