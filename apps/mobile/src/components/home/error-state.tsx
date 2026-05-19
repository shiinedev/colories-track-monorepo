import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";

export const ErrorState = ({
  error,
  refetch,
}: {
  error: never;
  refetch: () => void;
}) => {
  return (
    <View style={styles.errorState}>
      <View style={styles.errorIcon}>
        <Ionicons name="alert-circle-outline" size={28} color={Colors.error} />
      </View>
      <Text style={styles.errorTitle}>Unable to load data</Text>
      <Text style={styles.errorText}>{error.message}</Text>
      <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  errorState: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderError,
  },
  errorIcon: {
    backgroundColor: Colors.borderError,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  errorTitle: {
    color: Colors.error,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  errorText: {
    color: Colors.textTertiary,
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: fontWeight.semibold,
  },
});
