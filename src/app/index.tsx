import { Redirect } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const { isLoggedIn, hasPin } = useAuthStore();

  if (!isLoggedIn) return <Redirect href={hasPin ? "/unlock" : "/welcome"} />;
  return <Redirect href="/(tabs)" />;
}
