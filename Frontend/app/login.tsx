import { View, Text, Button } from "react-native";
import api from "../api/api";

export default function Login() {
  const testLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email: "future@test.com",
        password: "Password@123",
      });

      console.log("LOGIN SUCCESS ✅", res.data);
    } catch (err: any) {
      console.log("LOGIN ERROR ❌", err.response?.data || err.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Test</Text>
      <Button title="Test Login" onPress={testLogin} />
    </View>
  );
}
