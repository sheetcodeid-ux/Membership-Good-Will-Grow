import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { showToast } from "../store/toastStore";
import { tapError } from "./haptics";

export type ImageSource = "camera" | "library";

/**
 * Opens the camera or the photo library and hands back the picked image's
 * uri, or undefined when the member backs out. Asks for access first and
 * says plainly, in a toast, when it was refused. `square` crops to 1:1,
 * as a profile photo needs.
 */
export async function pickImage(
  source: ImageSource,
  { square = false }: { square?: boolean } = {},
): Promise<string | undefined> {
  const options: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: square ? [1, 1] : undefined,
    quality: 0.8,
  };
  try {
    // The web has no camera flow of its own: the file dialog covers both.
    if (source === "camera" && Platform.OS !== "web") {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        tapError();
        showToast("Izinkan akses kamera di pengaturan HP-mu", "error");
        return undefined;
      }
      const res = await ImagePicker.launchCameraAsync(options);
      return res.canceled ? undefined : res.assets[0]?.uri;
    }
    if (Platform.OS !== "web") {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        tapError();
        showToast("Izinkan akses galeri di pengaturan HP-mu", "error");
        return undefined;
      }
    }
    const res = await ImagePicker.launchImageLibraryAsync(options);
    return res.canceled ? undefined : res.assets[0]?.uri;
  } catch {
    tapError();
    showToast("Foto gagal dibuka, coba lagi", "error");
    return undefined;
  }
}
