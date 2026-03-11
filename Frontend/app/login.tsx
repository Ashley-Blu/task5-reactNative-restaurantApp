import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Login to get your faves delivered...
        </Text>

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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? "Signing in..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator style={styles.loader} />}

        <Text style={styles.footerText}>
          Does not have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.replace("/register")}
          >
            Signup here
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
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
    marginBottom: 14,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: "#F9BF01",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  loader: {
    marginTop: 8,
  },
  footerText: {
    marginTop: 16,
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  link: {
    color: "#F9BF01",
    fontWeight: "700",
  },
});
