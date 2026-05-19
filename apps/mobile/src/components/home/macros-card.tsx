import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

export const MacrosCard = ({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: number;
  Icon: "water-outline" | "flame-outline" | "leaf-outline";
  color: keyof Pick<typeof Colors, "blue" | "amber" | "blue">;
}) => {
  return (
    <View style={styles.macroCard}>
      <View
        style={
          color === "blue"
            ? styles.macroIconBlue
            : color === "amber"
              ? styles.macroIconAmber
              : styles.macroIconRose
        }
      >
        <Ionicons name={Icon} size={24} color={Colors[color]} />
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{value.toFixed(0)}g</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  macroCard: {
    flex: 1,
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
  macroIconBlue: {
    backgroundColor: Colors.blueTint,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroIconAmber: {
    backgroundColor: Colors.amberLight,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroIconRose: {
    backgroundColor: Colors.blueLight,
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  macroLabel: {
    color: Colors.black,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  macroValue: {
    color: Colors.black,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
});
