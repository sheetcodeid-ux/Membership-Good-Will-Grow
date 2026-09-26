import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Small, named haptics so call sites say what happened rather than which
 * motor pattern to play. All are fire-and-forget and silent on the web.
 */
const native = Platform.OS !== "web";

/** A choice was made: a chip, a tab, a radio. */
export function tapSelect() {
  if (native) Haptics.selectionAsync().catch(() => {});
}

/** A button that does something: copy, share, open. */
export function tapPress() {
  if (native)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Something was saved or completed. */
export function tapSuccess() {
  if (native)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {},
    );
}

/** Something was refused: invalid input, nothing found. */
export function tapError() {
  if (native)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
      () => {},
    );
}
