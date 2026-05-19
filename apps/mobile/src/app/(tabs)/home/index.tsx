import { CalorieTrack } from "@/components/home/calorie-card";
import { EmptyState } from "@/components/home/empty-state";
import { ErrorState } from "@/components/home/error-state";
import { Header } from "@/components/home/header";
import { MacrosCard } from "@/components/home/macros-card";
import { MealsCard } from "@/components/home/meals-card";
import { ProgressBar } from "@/components/home/progress-bar";
import {
  borderRadius,
  Colors,
  fontSize,
  fontWeight,
  spacing,
} from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { useGetFoodEntries } from "@/hooks/use-food";
import { useDailyReport } from "@/hooks/use-report";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  StatusBar,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const Home = () => {
  const { user, logout } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  console.log("user Home page", user);

  const getToday = (): string => {
    const today = new Date();
    return today.toISOString().split("T")[0] as string;
  };

  const today = getToday();

  const {
    data: foodEntries,
    isLoading: isLoadingFood,
    refetch: refetchFood,
  } = useGetFoodEntries(today);

  console.log("foodEntries", foodEntries);

  const {
    data: dailyReport,
    isLoading: isLoadingReport,
    refetch: refetchReport,
    error,
  } = useDailyReport(today);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchFood(), refetchReport()]);
    setIsRefreshing(false);
  }, []);

  const { dailygoal, cansumed, remaining, progress } = useMemo(() => {
    const dailygoal = user?.dailyColorieTarget || dailyReport?.goal || 2000;
    const cansumed = dailyReport?.consumed || 0;
    const remaining = dailyReport?.remaining || dailygoal - cansumed;
    const progress =
      dailyReport?.completedCalories || (cansumed / dailygoal) * 100;

    return { dailygoal, cansumed, remaining, progress };
  }, [user?.dailyColorieTarget, dailyReport]);

  const { carbs, protein, fat } = useMemo(() => {
    const carbs = dailyReport?.macros?.carbs.grams || 0;
    const protein = dailyReport?.macros?.protein.grams || 0;
    const fat = dailyReport?.macros?.fat.grams || 0;
    return { carbs, protein, fat };
  }, [dailyReport?.macros]);

  const meals = useMemo(() => {
    return foodEntries || [];
  }, [foodEntries]);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <Header username={user?.username || "user"} onLogout={handleLogout} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        <CalorieTrack
          consumed={cansumed}
          dailyGoal={dailygoal}
          remaining={remaining}
        />
        <ProgressBar value={progress} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/add")}>
            <Text style={styles.addButton}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {isLoadingFood && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading meals...</Text>
          </View>
        )}

        {/* Error State */}
        {error && isLoadingReport && (
          <ErrorState error={error} refetch={refetchReport} />
        )}

        {!isLoadingFood && !error && meals.length === 0 && <EmptyState />}

        {!isLoadingFood && !error && meals.length > 0 && (
          <View style={styles.mealsContainer}>
            {meals.map((meal) => (
              <MealsCard key={meal.id} meal={meal} />
            ))}
          </View>
        )}

        <Text style={styles.macrosTitle}>Today's Macros</Text>
        <View style={styles.macrosContainer}>
          <MacrosCard
            label="Carbs"
            value={carbs}
            Icon="flame-outline"
            color="blue"
          />
          <MacrosCard
            label="Protein"
            value={protein}
            Icon="leaf-outline"
            color="amber"
          />
          <MacrosCard
            label="Fat"
            value={fat}
            Icon="water-outline"
            color="blue"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.black,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  addButton: {
    color: Colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  macrosTitle: {
    color: Colors.black,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginTop: spacing.lg,
    marginBottom: 12,
  },
  macrosContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.xl,
  },

  loadingContainer: {
    backgroundColor: Colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    color: Colors.textTertiary,
    fontSize: fontSize.md,
    marginTop: 12,
  },
  mealsContainer: {
    gap: 12,
    marginBottom: spacing.lg,
  },
});

export default Home;
