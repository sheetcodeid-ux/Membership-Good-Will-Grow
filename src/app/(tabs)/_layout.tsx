import React, { useEffect, useRef } from "react";
import type { View } from "react-native";
import { Tabs } from "expo-router/js-tabs";
import { BlurTargetView } from "expo-blur";
import { CustomTabBar } from "../../components/CustomTabBar";
import { useBlurTargetStore } from "../../store/blurTargetStore";

/**
 * Wraps a tab's screen so the tab bar's glass can blur it. Android needs
 * this: its BlurView only blurs content inside a BlurTargetView, and
 * without one it shows the page through the bar in sharp focus.
 */
function TabBlurTarget({
  routeKey,
  children,
}: {
  routeKey: string;
  children: React.ReactNode;
}) {
  const ref = useRef<View>(null);
  useEffect(() => {
    const { register, unregister } = useBlurTargetStore.getState();
    register(routeKey, ref);
    return () => unregister(routeKey);
  }, [routeKey]);
  return (
    <BlurTargetView ref={ref} collapsable={false} style={{ flex: 1 }}>
      {children}
    </BlurTargetView>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      screenLayout={({ route, children }) => (
        <TabBlurTarget routeKey={route.key}>{children}</TabBlurTarget>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="order" />
      <Tabs.Screen name="member" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
