import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { UiText } from "../components/ui/Text";
import { AppHeader } from "../components/ui/AppHeader";
import { Glyph } from "../components/icons/Glyph";
import { EmptyArt } from "../components/EmptyArt";
import { PinDots, PinKeypad } from "../components/PinPad";
import { LABEL_INK, QUIET_INK } from "../components/AccountMenu";
import { brand, danger, surface } from "../theme/colors";
import { fontFamilies } from "../theme/typography";
import { useAuthStore } from "../store/authStore";
import { showToast } from "../store/toastStore";
import { tapError, tapSuccess } from "../utils/haptics";

type Step = "current" | "new" | "confirm";

const COPY: Record<Step, { title: string; hint: string }> = {
  current: {
    title: "Masukkan PIN saat ini",
    hint: "Untuk memastikan ini memang kamu",
  },
  new: {
    title: "Buat PIN baru",
    hint: "6 digit angka untuk masuk dan mengamankan akunmu",
  },
  confirm: {
    title: "Konfirmasi PIN",
    hint: "Masukkan ulang 6 digit PIN yang sama",
  },
};

/**
 * A PIN anyone could guess: one digit six times, or six in a row either
 * way (123456, 987654).
 */
function weakPin(pin: string) {
  if (/^(\d)\1{5}$/.test(pin)) return true;
  const d = pin.split("").map(Number);
  const up = d.every((n, i) => i === 0 || n === d[i - 1] + 1);
  const down = d.every((n, i) => i === 0 || n === d[i - 1] - 1);
  return up || down;
}

/**
 * Buat PIN, in two ways. Signing up (the default) asks for the new PIN and
 * its confirmation, then opens the app. `?mode=change`, from Detail Profil,
 * first checks the current PIN, keeps the account bar, and returns to the
 * profile once the new PIN is set.
 *
 * All steps live on this one screen: the dots and copy change in place, a
 * step counter shows how far along the member is, a wrong or weak PIN
 * shakes the dots with the reason under them.
 */
export default function CreatePinScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const changing = mode === "change";
  const pinCode = useAuthStore((s) => s.pinCode);
  const setPinStore = useAuthStore((s) => s.setPin);
  const loginSuccess = useAuthStore((s) => s.loginSuccess);

  const steps: Step[] = changing
    ? ["current", "new", "confirm"]
    : ["new", "confirm"];
  const [step, setStep] = useState<Step>(steps[0]);
  const [pin, setPin] = useState("");
  const [first, setFirst] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [shake, setShake] = useState(0);
  const index = steps.indexOf(step);
  // Short phones (SE-sized) drop the lock art so the keypad still fits.
  const { height } = useWindowDimensions();
  const roomy = height >= 740;

  const refuse = (message: string) => {
    tapError();
    setError(message);
    setShake((n) => n + 1);
    setTimeout(() => setPin(""), 420);
  };

  const advance = (next: Step) => {
    setTimeout(() => {
      setPin("");
      setStep(next);
    }, 180);
  };

  const onChange = (next: string) => {
    setError(undefined);
    setPin(next);
    if (next.length < 6) return;

    if (step === "current") {
      // Without a PIN set on this device there is nothing to check against.
      if (pinCode && next !== pinCode) {
        refuse("PIN salah, coba lagi.");
        return;
      }
      advance("new");
    } else if (step === "new") {
      if (weakPin(next)) {
        refuse("PIN terlalu mudah ditebak. Hindari angka berurutan atau sama.");
        return;
      }
      if (changing && pinCode && next === pinCode) {
        refuse("PIN baru harus beda dari PIN saat ini.");
        return;
      }
      setFirst(next);
      advance("confirm");
    } else {
      if (next !== first) {
        refuse("PIN tidak sama. Coba lagi.");
        return;
      }
      tapSuccess();
      setPinStore(next);
      setTimeout(() => {
        if (changing) {
          showToast("PIN berhasil diubah");
          if (router.canGoBack()) router.back();
          else router.replace("/profile-detail");
        } else {
          loginSuccess();
          router.replace("/(tabs)");
        }
      }, 180);
    }
  };

  const back = () => {
    // From the confirmation, back means choosing the PIN again.
    if (step === "confirm") {
      setPin("");
      setError(undefined);
      setStep("new");
      return;
    }
    if (router.canGoBack()) router.back();
    else router.replace(changing ? "/profile-detail" : "/welcome");
  };

  const copy = COPY[step];

  return (
    <View style={{ flex: 1, backgroundColor: surface }}>
      <StatusBar style="dark" />
      {changing ? (
        <AppHeader tone="account" title="Ubah PIN" onBack={back} />
      ) : (
        <AppHeader title="Buat PIN" onBack={back} />
      )}

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24 }}>
          {roomy ? (
            <View style={{ alignItems: "center", marginTop: 18 }}>
              <EmptyArt glyph="lock" size={96} />
            </View>
          ) : null}

          {/* Step counter: a short bar per step, filled up to this one. */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              marginTop: roomy ? 4 : 12,
            }}
          >
            {steps.map((s, i) => (
              <View
                key={s}
                style={{
                  width: i === index ? 22 : 12,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: i <= index ? brand[600] : "#D5DBE7",
                }}
              />
            ))}
          </View>

          <Animated.View key={step} entering={FadeIn.duration(220)}>
            <UiText
              color={LABEL_INK}
              style={{
                marginTop: roomy ? 16 : 12,
                textAlign: "center",
                fontSize: 22,
                lineHeight: 28,
                fontFamily: fontFamilies.extrabold,
              }}
            >
              {copy.title}
            </UiText>
            <UiText
              color={QUIET_INK}
              style={{
                marginTop: 6,
                textAlign: "center",
                fontSize: 14,
                lineHeight: 19,
                fontFamily: fontFamilies.medium,
              }}
            >
              {copy.hint}
            </UiText>
          </Animated.View>

          <View style={{ marginTop: roomy ? 30 : 18 }}>
            <PinDots value={pin} error={!!error} shake={shake} />
          </View>

          {/* Fixed height, so the keypad does not jump when a reason shows. */}
          <View
            style={{
              minHeight: 40,
              marginTop: 12,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {error ? (
              <UiText
                color={danger[500]}
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: fontFamilies.semibold,
                }}
              >
                {error}
              </UiText>
            ) : step === "new" ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Glyph name="shield" size={13} color={QUIET_INK} />
                <UiText
                  color={QUIET_INK}
                  style={{
                    fontSize: 12.5,
                    lineHeight: 17,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Jangan bagikan PIN ke siapa pun.
                </UiText>
              </View>
            ) : null}
          </View>

          <View style={{ flex: 1 }} />

          <PinKeypad value={pin} onChange={onChange} />
          <View style={{ height: roomy ? 28 : 14 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}
