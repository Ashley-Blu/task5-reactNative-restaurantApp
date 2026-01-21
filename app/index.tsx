import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/*Landing page*/}
      {/*The restaurants logo*/}
      <Image
        style={styles.logo}
        source={require("../assets/images/logo.png")}
      />
      
      {/*The restaurant name*/}
      <Text style={styles.text}>
        <Text style={styles.span}>F</Text>oodie...
      </Text>
    </SafeAreaView>
  );
};

export default index;

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
