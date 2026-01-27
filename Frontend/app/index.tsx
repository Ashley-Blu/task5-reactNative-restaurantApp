import { StyleSheet, Text, Image } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/welcome"); // remove landing from history
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        style={styles.logo}
        source={require("../assets/images/logo.png")}
      />

      {/* App name */}
      <Text style={styles.text}>
        <Text style={styles.span}>F</Text>oodie...
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  logo: {
    width: 80,
    height: 79,
    resizeMode: "contain",
  },

  text: {
    color: "#000",
    fontSize: 32,
    fontWeight: "bold",
  },

  span: {
    color: "#F9BF01",
  },
});
