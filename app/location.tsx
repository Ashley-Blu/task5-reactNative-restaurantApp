import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Location = () => {
  return (
    <SafeAreaView style={styles.container}>

  {/* Top illustration */}
  <View style={styles.topSection}>
    <Image
      source={require("../assets/images/Welcome/scooter.png")}
      style={styles.image}
    />
  </View>

  {/* Content */}
  <View style={styles.content}>

    <Text style={styles.title}>Help us find you.</Text>

    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Please enter your location..."
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>

    <TouchableOpacity style={styles.primaryButton}>
      <Text style={styles.primaryText}>Enter</Text>
    </TouchableOpacity>

    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      <Text style={styles.or}>or</Text>
      <View style={styles.line} />
    </View>

    <TouchableOpacity style={styles.secondaryButton}>
      <Text style={styles.secondaryText}>Use current location</Text>
    </TouchableOpacity>

  </View>

</SafeAreaView>

  );
};

export default Location;

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: "#fff",
},

topSection: {
  alignItems: "center",
  marginTop: 40,
},

image: {
  width: 140,
  height: 140,
  resizeMode: "contain",
},

content: {
  paddingHorizontal: 24,
  marginTop: 30,
},

title: {
  fontSize: 22,
  fontWeight: "700",
  color: "#000",
  textAlign: "center",
  marginBottom: 30,
},

inputContainer: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#F9BF01",
  borderRadius: 10,
  paddingHorizontal: 12,
  height: 50,
  justifyContent: "center",
  marginBottom: 20,
},

input: {
  fontSize: 15,
  color: "#000",
},

primaryButton: {
  width: "100%",
  backgroundColor: "#F9BF01",
  height: 50,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

primaryText: {
  color: "#000",
  fontWeight: "700",
  fontSize: 16,
},

dividerContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginVertical: 25,
},

line: {
  flex: 1,
  height: 1,
  backgroundColor: "#ccc",
},

or: {
  marginHorizontal: 10,
  color: "#999",
},

secondaryButton: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#F9BF01",
  height: 50,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

secondaryText: {
  color: "#000",
  fontWeight: "600",
  fontSize: 15,
},
});
