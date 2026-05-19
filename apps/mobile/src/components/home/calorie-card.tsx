import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { Text, View, StyleSheet } from "react-native";

export const CalorieTrack = ({
  consumed,
  dailyGoal,
  remaining,
}: {
  consumed: number;
  dailyGoal: number;
  remaining: number;
}) => {
  return (
    <View style={styles.calorieCard}>
      <View style={styles.calorieCardContent}>
        {/* Progress Circle */}
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>{consumed}</Text>
          <Text style={styles.progressLabel}>eaten</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Daily Goal</Text>
            <Text style={styles.statValue}>{dailyGoal} cal</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={styles.statValueRemaining}>{remaining} cal</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  calorieCard: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calorieCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 96,
    height: 96,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.blueLight,
    borderWidth: 4,
    borderColor: Colors.primaryLight,
  },
  progressText: {
    color: Colors.primary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  progressLabel: {
    color: Colors.textTertiary,
    fontSize: fontSize.base,
  },
  stats: {
    flex: 1,
    marginLeft: 20,
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    color: Colors.textTertiary,
    fontSize: fontSize.base,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: fontWeight.medium,
  },
  statValue: {
    color: Colors.black,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
  statValueRemaining: {
    color: Colors.emerald,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
  },
});
