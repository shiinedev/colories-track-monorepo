import ImagePickerExample from "@/components/add/image-picker";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useDiscardFood, useSaveFood, useScanFood } from "@/hooks/use-food";
import FoodPreviewModal from "@/components/add/food-preview-modal";
import { TextInput } from "react-native";
import { ScanFoodResult } from "@/types";

export const Add = () => {
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [foodData, setFoodData] = useState<ScanFoodResult | null>(null);

  const scanMutation = useScanFood();
  const saveFood = useSaveFood();
  const discardMutation = useDiscardFood();

  const onChangeImage = (image: ImagePicker.ImagePickerAsset | null) => {
    setImage(image);
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image before submitting.");
      return;
    }

    // @ts-ignore
    const formData = new FormData();
    formData.append("image", {
      uri: image?.uri,
      type: image.mimeType || "image/jpeg",
      name: image.fileName || "image.jpg",
    } as any);

    console.log("FormData", formData);

    await scanMutation.mutateAsync(formData, {
      onSuccess: (data) => {
        setOpenModel(true);
        console.log("ScanFoodResult", {
          foodname: data.foodname,
          description: data.description,
        });
        Alert.alert(
          "Success",
          `Food scanned successfully${
            data.foodname ? `: ${data.foodname}` : ""
          }`,
        );
        setFoodName(data.foodname);
        setDescription(data.description);
        setFoodData(data);
      },
      onError: (error) => {
        Alert.alert("Error for Scanning food", error.message);
      },
    });
  };

  const handleDecline = async () => {
    if (!foodData) {
      Alert.alert("Error", "No food data available.");
      return;
    }

    await discardMutation.mutateAsync(foodData.storageKey, {
      onSuccess: () => {
        setOpenModel(false);
        setFoodData(null);
      },
      onError: (error) => {
        Alert.alert("Error", error.message);
      },
    });
  };

  const handleAccept = async () => {
    console.log("foodData in handleAccept", {
      foodname: foodData?.foodname,
      description: foodData?.description,
    });

    if (!foodData) {
      Alert.alert("Error", "No food data available.");
      return;
    }

    try {
      await saveFood.mutateAsync(foodData, {
        onSuccess: () => {
          Alert.alert("Success", "Food saved successfully.");
          setOpenModel(false);
          setFoodData(null);
        },
        onError: (error) => {
          Alert.alert("Error", (error as Error).message);
        },
      });
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={0}
    >
      <StatusBar style="dark" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerLabel}>New Entry</Text>
          <Text style={styles.headerTitle}>Log Your Meal</Text>
          <Text style={styles.headerSubtitle}>
            Add a photo or describe what you ate
          </Text>
        </View>

        <ImagePickerExample
          image={image}
          onChangeImage={onChangeImage}
          isPending={scanMutation.isPending}
        />

        <Text style={styles.label}>Food Name (Optional - AI will detect)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="e.g., Chicken Salad (optional)"
            value={foodName}
            onChangeText={setFoodName}
            placeholderTextColor={Colors.textTertiary}
            style={styles.input}
            editable={!scanMutation.isPending}
          />
        </View>

        {/* Description (Optional) */}
        <Text style={styles.label}>Description (Optional)</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Describe your meal..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={Colors.textTertiary}
            style={styles.textArea}
            editable={!scanMutation.isPending}
          />
        </View>

        {/* Submit Button */}

        {/* Analyze Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={[
            styles.submitButton,
            (scanMutation.isPending || !image) && styles.submitButtonDisabled,
          ]}
          disabled={scanMutation.isPending || !image}
        >
          {scanMutation.isPending ? (
            <>
              <ActivityIndicator
                color={Colors.white}
                size="small"
                style={styles.loader}
              />
              <Text style={styles.submitButtonText}>Scanning Food...</Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>Scan Food</Text>
          )}
        </TouchableOpacity>

        <FoodPreviewModal
          visible={openModel}
          foodData={foodData}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingTop: 64,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLabel: {
    color: Colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    color: Colors.black,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    marginTop: 4,
  },
  headerSubtitle: {
    color: Colors.textTertiary,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
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
  label: {
    color: Colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.sm,
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
    marginHorizontal: spacing.sm,
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
});
