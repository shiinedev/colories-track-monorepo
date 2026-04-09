import {
  Colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
} from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    try {
      await login.mutateAsync({ email, password });
      router.replace("/(tabs)/home");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("error from login", error);
      Alert.alert("Error", "Inavlid Credentials, Please try again.");
      setPassword("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle={"dark-content"} />
      <ScrollView style={styles.scrollContent}>
        <View style={styles.content}>
          {/*header*/}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="restaurant" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.title}>sign in</Text>
            <Text style={styles.subtitle}>
              Sign in to continue tracking your meals
            </Text>
          </View>

          {/*form*/}

          <View style={styles.form}>
            {/*Input group for email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={Colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/*Input group for password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {/*sign in button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={login.isPending}
              activeOpacity={0.8}
            >
              {login.isPending ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            {/*register link */}
            <View style={styles.registerLink}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/register")}>
                <Text style={styles.registerLinkText}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 80,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    backgroundColor: Colors.blueDark,
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.black,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  form: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    color: Colors.black,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
    fontSize: 16,
    color: Colors.black,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: borderRadius.md,
    elevation: 8,
  },
  buttonText: {
    color: Colors.white,
    textAlign: "center",
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
  },

  scrollContent: {
    flexGrow: 1,
  },

  registerLink: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  registerText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  registerLinkText: {
    color: Colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
