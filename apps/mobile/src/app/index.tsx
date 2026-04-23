import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { getAuthToken } from "@/utils/storage";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function IndexScreen() {
  const { isAuthenticated, user, isLoading, isReady } = useAuth();

  console.log(
    "isAuthenticated",
    isAuthenticated,
    "user",
    user,
    "isLoading",
    isLoading,
  );

  useEffect(() => {
    const checkToken = async () => {
      const token = await getAuthToken();
      console.log("token ", token);
    };
    checkToken();
  }, []);

  if (!isReady && isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.background,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    if (user && !user.onBoardingCompleted) {
      return <Redirect href="/onboarding" />;
    }
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}
