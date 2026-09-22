import { Redirect } from "expo-router";
import { useAuthStore } from "../store/authStore";

export default function Index() {
  const { hasOnboarded, isLoggedIn, hasPin } = useAuthStore();

  if (!hasOnboarded) return <Redirect href="/welcome" />;
  if (!isLoggedIn && !hasPin) return <Redirect href="/login" />;
  if (!isLoggedIn && hasPin) return <Redirect href="/unlock" />;
  return <Redirect href="/(tabs)" />;
}
