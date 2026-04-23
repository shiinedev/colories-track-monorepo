import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/authContext";
import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

const Home = () => {
  const { user } = useAuth();

  console.log("user", user);

  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <Link href="/login">
        <Text>Go to Login</Text>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default Home;
