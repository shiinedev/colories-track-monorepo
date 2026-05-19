import { StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { FoodEntry } from "@/types";

export const MealsCard = ({ meal }: { meal: FoodEntry }) => {
  return (
    <View key={meal.id} style={styles.mealCard}>
      <View style={styles.mealContent}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealName}>{meal.foodname}</Text>
          <Text style={styles.mealCalories}>{meal.calories} cal</Text>
        </View>
        <View style={styles.mealDetails}>
          <View style={styles.mealMacros}>
            <View style={styles.mealMacroItem}>
              <Ionicons name="flame-outline" size={12} color={Colors.blue} />
              <Text style={styles.mealMacroText}>{meal.protein}g</Text>
            </View>
            <View style={styles.mealMacroItem}>
              <Ionicons name="leaf-outline" size={12} color={Colors.amber} />
              <Text style={styles.mealMacroText}>{meal.carbs}g</Text>
            </View>
            <View style={styles.mealMacroItem}>
              <Ionicons name="water-outline" size={12} color={Colors.primary} />
              <Text style={styles.mealMacroText}>{meal.fat}g</Text>
            </View>
          </View>
          <Text style={styles.mealTime}>
            {new Date(meal.timestamp).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  mealsContainer: {
    gap: 12,
    marginBottom: spacing.lg,
  },
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealContent: {
    gap: spacing.sm,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    color: Colors.textSecondary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  mealCalories: {
    color: Colors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },
  mealDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealMacros: {
    flexDirection: "row",
    gap: 12,
  },
  mealMacroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mealMacroText: {
    color: Colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  mealTime: {
    color: Colors.textTertiary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
});
