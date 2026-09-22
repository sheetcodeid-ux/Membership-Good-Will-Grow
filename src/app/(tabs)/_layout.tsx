import { Tabs } from "expo-router/js-tabs";
import { CustomTabBar } from "../../components/CustomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="order" />
      <Tabs.Screen name="member" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
