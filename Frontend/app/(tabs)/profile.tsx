import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as userApi from "../../api/user";
import { Button, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  type Order = {
    id: number;
    status: string;
    total_price: number;
    created_at: string;
  };
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await userApi.getOrderHistory();
        setOrders(res.data);
      } catch (err) {
        setError("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={{ marginBottom: 16 }}>
          You need to be logged in to view your profile and orders.
        </Text>
        <Button
          title="Go to Login"
          onPress={() => router.replace("/login")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>
            Name: <Text style={styles.value}>{user.name || "-"}</Text>
          </Text>
          <Text style={styles.label}>
            Email: <Text style={styles.value}>{user.email}</Text>
          </Text>
          <Button title="Logout" color="#d32f2f" onPress={handleLogout} />
        </View>
      )}
      <Text style={styles.sectionTitle}>Order History</Text>
      {loading && <Text>Loading...</Text>}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: R{item.total_price}</Text>
            <Text>Date: {new Date(item.created_at).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={() => !loading ? <Text>No orders found.</Text> : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoBox: {
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 16,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontWeight: "normal",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  orderId: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
