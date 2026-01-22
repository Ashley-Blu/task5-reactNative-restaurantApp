import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import * as Location from "expo-location";
import EvilIcons from "@expo/vector-icons/EvilIcons";

const LocationPage = () => {
  const [location, setLocation] = useState("");
  {
    /*Function handles manual location input */
  }
  const handleManualLocation = async () => {
    if (!location.trim()) {
      Toast.show({
        type: "error",
        text1: "Location cannot be empty.",
        text2: "Please enter your valid location.",
      });
      return;
    }

    try {
      await AsyncStorage.setItem("userLocation", location);

      Toast.show({
        type: "success",
        text1: "Location saved successfully!",
        text2: "Finding restaurants near you.",
      });

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1500);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to save location.",
        text2: "Please try again.",
      });
    }
  };
  {
    /*Function handles current location input */
  }
  const handleCurrentLocation = async () => {
    try {
      //Ask for location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permission denied.",
          text2: "Allow location access to use current location.",
        });
        return;
      }

      //Get coordinates of users current location
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = userLocation.coords;

      //Reverse geocode to get human-readable address
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const place =
        address[0]?.city ||
        address[0]?.subregion ||
        address[0]?.region ||
        "Current location";

      //Store location in AsyncStorage
      await AsyncStorage.setItem("userLocation", place);

      Toast.show({
        type: "success",
        text1: place + " saved successfully!",
        text2: " Finding restaurants near you...",
      });
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 1500);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Location error",
        text2: "Unable to get your location",
      });
    }
  };

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
          <EvilIcons name="location" size={24} color="black" />
          <TextInput
            placeholder="Please enter your location..."
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleManualLocation}
        >
          <Text style={styles.primaryText}>Enter</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleCurrentLocation}
        >
          <EvilIcons name="check" size={24} color="black" />
          <Text style={styles.secondaryText}>Use current location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationPage;

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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },

  input: {
    flex: 1,
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  secondaryText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },
});
