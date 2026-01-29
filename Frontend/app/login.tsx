import {
  View,
  Text,
  Button,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
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

      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />

      {loading && <ActivityIndicator style={styles.loader} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },

  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },

  loader: {
    marginTop: 16,
  },
});
