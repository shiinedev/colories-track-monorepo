import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feature } from "@/types";

export const FeaturesCard = ({ iconColor, title, text }: Feature) => {
  return (
    <View style={styles.featureCard}>
      <View style={[styles.Iconbase, styles[iconColor]]}>
        <Ionicons name="camera" size={24} color={Colors.primary} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureText}>{text}</Text>
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 20,
    borderRadius: borderRadius.lg,
    marginBottom: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: fontSize.lg,
    color: Colors.textDark,
    fontWeight: fontWeight.bold,
    marginBottom: 4,
  },
  featureText: {
    fontSize: fontSize.md,
    color: Colors.textGray,
  },
  Iconbase: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  IconBlue: {
    backgroundColor: Colors.blueTint,
  },
  IconAmber: {
    backgroundColor: Colors.amberTint,
  },
  IconViolet: {
    backgroundColor: Colors.violetTint,
  },
});
