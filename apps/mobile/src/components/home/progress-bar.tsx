import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { Text, View, StyleSheet } from "react-native";

export const ProgressBar = ({ value }: { value: number }) => {
  return (
    <View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(value, 100)}%` },
          ]}
        />
      </View>
      <Text style={styles.progressBarText}>
        {value.toFixed(0)}% of daily goal
      </Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: borderRadius.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primaryLight,
    borderRadius: borderRadius.full,
  },
  progressBarText: {
    color: Colors.textTertiary,
    fontSize: fontSize.base,
    marginTop: spacing.sm,
    textAlign: "center",
    fontWeight: fontWeight.medium,
  },
});
