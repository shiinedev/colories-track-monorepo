import {
  Alert,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";

export default function ImagePickerExample({
  image,
  onChangeImage,
  isPending,
}: {
  image: ImagePicker.ImagePickerAsset | null;
  onChangeImage: (image: ImagePicker.ImagePickerAsset | null) => void;
  isPending: boolean;
}) {
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permission Required",
        "we need your permission to access your camera and media library",
        [{ text: "OK" }],
      );
      return false;
    }

    return true;
  };

  const handleImagePicker = async (source: "camera" | "gallery") => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    let result: ImagePicker.ImagePickerResult;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets[0]) {
      onChangeImage(result.assets[0]);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Image Source",
      "Choose an image from your camera or gallery",
      [
        {
          text: "Camera",
          onPress: () => handleImagePicker("camera"),
        },
        {
          text: "Gallery",
          onPress: () => handleImagePicker("gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  return (
    <View style={styles.container}>
      {image && (
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: image.uri }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => onChangeImage(null)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        onPress={showImagePickerOptions}
        activeOpacity={0.7}
        style={[styles.imagePickerButton, isPending && styles.disabled]}
        disabled={isPending}
      >
        <View style={styles.imagePickerIcon}>
          <Ionicons
            name={image ? "image-outline" : "camera-outline"}
            size={22}
            color={Colors.primary}
          />
        </View>
        <Text style={styles.imagePickerText}>
          {image ? "Change Image" : "Take Photo or Select from Gallery"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
  },

  imageWrapper: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: 256,
    borderRadius: borderRadius.md,
  },
  closeButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    backgroundColor: Colors.overlay,
    borderRadius: borderRadius.full,
    padding: spacing.sm,
  },
  imagePickerButton: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  imagePickerIcon: {
    backgroundColor: Colors.blueLight,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  imagePickerText: {
    color: Colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    color: Colors.text,
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  textArea: {
    color: Colors.text,
    fontSize: fontSize.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    height: 112,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  loader: {
    marginRight: spacing.sm,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  tipCard: {
    backgroundColor: Colors.violetTint,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: Colors.amberLight,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipIcon: {
    backgroundColor: Colors.amberLight,
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: Colors.amberDark,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  tipText: {
    color: Colors.amberLight,
    fontSize: fontSize.base,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
});
