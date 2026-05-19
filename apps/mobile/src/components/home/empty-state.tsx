import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useRouter } from "expo-router";

export const EmptyState = ({}) => {
  const router = useRouter();

  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIcon}>
        <Ionicons
          name="restaurant-outline"
          size={28}
          color={Colors.textTertiary}
        />
      </View>
      <Text style={styles.emptyStateTitle}>No meals logged yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking by logging your first meal
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/add")}
        style={styles.emptyStateButton}
      >
        <Text style={styles.emptyStateButtonText}>Log Your First Meal</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateIcon: {
    backgroundColor: Colors.surfaceSecondary,
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    color: Colors.textMedium,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    marginBottom: 4,
  },
  emptyStateText: {
    color: Colors.textTertiary,
    fontSize: fontSize.md,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
  },
  emptyStateButtonText: {
    color: Colors.white,
    fontWeight: fontWeight.semibold,
  },
});
