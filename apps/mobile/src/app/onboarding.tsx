import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { FeaturesCard } from "@/components/features-card";
import { FEATURES } from "@/constants/config";

const Onboarding = () => {
  const { updateProfile } = useAuth();

  const handleGetStarted = async () => {
    await updateProfile.mutateAsync(
      {
        onBoardingCompleted: true,
      },
      {
        onSuccess: () => {
          router.replace("/(tabs)/home");
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="restaurant" size={72} color={Colors.primary} />
          </View>

          <Text style={styles.title}>Welcome to Diet Tracker</Text>
          <Text style={styles.subtitle}>
            Track your meals, monitor calories, and achieve your health goals
          </Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {FEATURES.map((feature, index) => (
              <FeaturesCard
                key={index}
                iconColor={feature.iconColor}
                title={feature.title}
                text={feature.text}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={handleGetStarted}
            disabled={updateProfile.isPending}
            activeOpacity={0.8}
            style={styles.button}
          >
            {updateProfile.isPending ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.buttonText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  scrollContent: {
    flexGrow: 1,
  },
  iconContainer: {
    backgroundColor: Colors.blue,
    width: 128,
    height: 128,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.massive,
    fontWeight: fontWeight.bold,
    color: Colors.black,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.xl,
    color: Colors.textGrayDark,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xl,
    width: "100%",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    textAlign: "center",
  },
});
