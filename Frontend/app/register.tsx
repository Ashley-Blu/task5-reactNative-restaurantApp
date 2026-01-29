import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { router } from "../.expo/types/router";

export default function Register() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

 const handleRegister = async () => {
  try {
    setLoading(true);
    await authApi.register({ email, password, name });
    await login(email, password);
    router.replace("/(tabs)/home");
  } catch (err: any) {
    setError(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success && !error ? (
        <Text style={styles.success}>Registration successful!</Text>
      ) : null}
      <Button
        title={loading ? "Registering..." : "Register"}
        onPress={handleRegister}
        disabled={loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  success: {
    color: "green",
    marginBottom: 8,
  },
});
