import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function Cart() {
  const { items, increase, decrease, totalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleCheckoutPress = () => {
    if (!user) {
      Alert.alert(
        "Login required",
        "Please login before checking out.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
        ],
      );
      return;
    }

    // Navigate to dedicated checkout screen
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Your cart is empty 🛒</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R{item.price}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => decrease(item.id)}
                >
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => increase(item.id)}
                >
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* TOTAL + CHECKOUT */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>R{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckoutPress}
          disabled={loading}
        >
          <Text style={styles.checkoutText}>
            {loading ? "Processing..." : "Checkout"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    fontSize: 16,
    color: "#666",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fafafa",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 12,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 14,
    marginRight: 12,
  },

  info: {
    flex: 1,
    justifyContent: "space-between",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  price: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyText: {
    fontSize: 18,
    fontWeight: "800",
  },

  quantity: {
    marginHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    padding: 16,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
  },

  checkoutBtn: {
    backgroundColor: "#F9BF01",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },

  checkoutText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
});
