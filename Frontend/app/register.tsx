import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { router } from "expo-router";

export default function Register() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      await authApi.register({
        name,
        surname,
        email,
        password,
        phone,
        address,
      });

      setSuccess(true);

      // Auto-login after successful registration
      await login(email, password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.heading}>Hello!</Text>
        <Text style={styles.subtitle}>
          Welcome to Foodie pizza station...
        </Text>

        <Text style={styles.label}>Name:</Text>
        <TextInput
          placeholder="Please enter your name..."
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.label}>Surname:</Text>
        <TextInput
          placeholder="Please enter your surname..."
          placeholderTextColor="#999"
          value={surname}
          onChangeText={setSurname}
          style={styles.input}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          placeholder="Please enter your email address..."
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <Text style={styles.label}>Phone number:</Text>
        <TextInput
          placeholder="Please enter your phone number..."
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Text style={styles.label}>Delivery address:</Text>
        <TextInput
          placeholder="Please enter your delivery address..."
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <Text style={styles.label}>Password:</Text>
        <TextInput
          placeholder="Please enter your password..."
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success && !error ? (
          <Text style={styles.success}>Registration successful!</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Registering..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.replace("/login")}
          >
            Sign-in here
          </Text>
        </Text>

        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#F9BF01",
    backgroundColor: "#fffaf0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  success: {
    color: "green",
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#F9BF01",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: "#555",
  },
  link: {
    color: "#F9BF01",
    fontWeight: "700",
  },
});
