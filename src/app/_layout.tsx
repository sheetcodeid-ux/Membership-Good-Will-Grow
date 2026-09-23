import "../global.css";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Stack, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { PromoPopup } from "../components/PromoPopup";
import { OutletServiceSheet } from "../components/OutletServiceSheet";
import { ShortcutMenu } from "../components/ShortcutMenu";
import { useUiStore } from "../store/uiStore";
import { useOrderStore } from "../store/orderStore";
import {
  useFonts,
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
} from "@expo-google-fonts/urbanist";

SplashScreen.preventAutoHideAsync().catch(() => {});
SystemUI.setBackgroundColorAsync("#FFFFFF").catch(() => {});

export default function RootLayout() {
  const promoOpen = useUiStore((s) => s.promoOpen);
  const closePromo = useUiStore((s) => s.closePromo);
  const pathname = usePathname();
  const outletConfirmed = useOrderStore((s) => s.outletConfirmed);
  const shortcutsOpen = useUiStore((s) => s.shortcutsOpen);
  const closeShortcuts = useUiStore((s) => s.closeShortcuts);
  const [fontsLoaded] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
  });

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#FFFFFF" }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="login"
            options={{ presentation: "transparentModal", animation: "fade" }}
          />
          <Stack.Screen
            name="product/[id]"
            options={{ presentation: "transparentModal", animation: "fade" }}
          />

          <Stack.Screen
            name="comments/[postId]"
            options={{ presentation: "transparentModal", animation: "fade" }}
          />
        </Stack>
        {/* Both sheets live above the navigator so they dim the tab bar too. */}
        {pathname === "/order" && !outletConfirmed ? <OutletServiceSheet /> : null}
        {shortcutsOpen ? <ShortcutMenu onClose={closeShortcuts} /> : null}
        {promoOpen ? <PromoPopup onClose={closePromo} /> : null}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
