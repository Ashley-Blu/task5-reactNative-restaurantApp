import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import * as checkoutApi from "../api/checkout";

type CardDetails = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
};

const CARD_STORAGE_KEY = "cardDetails";
const ADDRESS_STORAGE_KEY = "deliveryAddressOverride";

export default function Checkout() {
  const router = useRouter();
  const { items, totalPrice } = useCart();
  const { user } = useAuth();

  const [address, setAddress] = useState(user?.address || "");
  const [card, setCard] = useState<CardDetails>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStored = async () => {
      const [storedCard, storedAddress] = await Promise.all([
        AsyncStorage.getItem(CARD_STORAGE_KEY),
        AsyncStorage.getItem(ADDRESS_STORAGE_KEY),
      ]);

      if (storedCard) {
        setCard(JSON.parse(storedCard));
      }
      if (storedAddress) {
        setAddress(storedAddress);
      } else if (user?.address) {
        setAddress(user.address);
      }
    };

    if (!user) {
      router.replace("/login");
      return;
    }

    loadStored();
  }, [user, router]);

  const handleSaveAndCheckout = async () => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Missing address", "Please enter a delivery address.");
      return;
    }

    if (
      !card.cardNumber.trim() ||
      !card.expiry.trim() ||
      !card.cvv.trim() ||
      !card.nameOnCard.trim()
    ) {
      Alert.alert("Missing card details", "Please fill in all card fields.");
      return;
    }

    try {
      setLoading(true);

      // Persist address & card locally (for Task 5 profile/card requirement)
      await Promise.all([
        AsyncStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(card)),
        AsyncStorage.setItem(ADDRESS_STORAGE_KEY, address),
      ]);

      // Call backend checkout to create order & clear cart on server
      const res = await checkoutApi.checkout();

      Alert.alert(
        "Order placed",
        `Your order #${res.data.orderId} has been placed.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/profile"),
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        "Checkout failed",
        err?.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <Text style={styles.title}>Checkout</Text>

        {/* ORDER SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order summary</Text>
          {items.map((item) => (
            <Text key={item.id} style={styles.lineItem}>
              {item.quantity} x {item.name} — R
              {(item.price * item.quantity).toFixed(2)}
            </Text>
          ))}
          <Text style={styles.total}>
            Total: R{totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* ADDRESS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery address</Text>
          <TextInput
            placeholder="Enter delivery address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={[styles.input, { height: 70 }]}
          />
        </View>

        {/* CARD DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card details</Text>
          <TextInput
            placeholder="Name on card"
            value={card.nameOnCard}
            onChangeText={(text) => setCard((c) => ({ ...c, nameOnCard: text }))}
            style={styles.input}
          />
          <TextInput
            placeholder="Card number"
            keyboardType="number-pad"
            value={card.cardNumber}
            onChangeText={(text) =>
              setCard((c) => ({ ...c, cardNumber: text }))
            }
            style={styles.input}
          />
          <View style={styles.row}>
            <TextInput
              placeholder="MM/YY"
              value={card.expiry}
              onChangeText={(text) =>
                setCard((c) => ({ ...c, expiry: text }))
              }
              style={[styles.input, styles.half]}
            />
            <TextInput
              placeholder="CVV"
              value={card.cvv}
              onChangeText={(text) => setCard((c) => ({ ...c, cvv: text }))}
              keyboardType="number-pad"
              style={[styles.input, styles.half]}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handleSaveAndCheckout}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? "Placing order..." : "Place order"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  lineItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  total: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  half: {
    flex: 1,
  },
  placeOrderBtn: {
    backgroundColor: "#F9BF01",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
});

