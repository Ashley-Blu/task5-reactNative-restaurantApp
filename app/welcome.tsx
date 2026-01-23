import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 70, // small distance
      duration: 3500, // slow & smooth
      useNativeDriver: true,
    }).start(() => {
      router.replace("/location");
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top right leaf */}
      <Image
        source={require("../assets/images/welcome/leaf.png")}
        style={styles.leafTop}
      />

      {/* Text section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Happy <Text style={styles.span}>food</Text>
        </Text>
        <Text style={styles.title}>delivery.</Text>

        <Text style={styles.text}>Best Pizza's in town just for you.</Text>
        <Text style={styles.text}>With just a few clicks, we will</Text>
        <Text style={styles.text}>be at your porch or you at ours.</Text>
      </View>

      {/* CENTER BLOCK */}
      <View style={styles.centerContainer}>
        <Animated.Image
          source={require("../assets/images/welcome/scooter.png")}
          style={[
            styles.scooter,
            {
              transform: [{ translateX }],
            },
          ]}
        />

        <Text style={styles.footerText}>Foodie coming your way...</Text>
      </View>

      {/* Bottom left leaf */}
      <Image
        source={require("../assets/images/welcome/leaf.png")}
        style={styles.leafBottom}
      />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* Decorative leaves */
  leafTop: {
    position: "absolute",
    top: 20,
    right: 0,
    width: 120,
    height: 75,
    resizeMode: "contain",
  },

  leafBottom: {
    position: "absolute",
    bottom: 20,
    left: 0,
    width: 120,
    height: 75,
    resizeMode: "contain",
  },

  /* Text */
  textContainer: {
    marginTop: 60,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },

  span: {
    color: "#F9BF01",
  },

  text: {
    marginTop: 6,
    fontSize: 16,
    color: "#555",
  },

  /* CENTERED scooter + footer */
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scooter: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",                                    
  },

  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#000",
  },
});
