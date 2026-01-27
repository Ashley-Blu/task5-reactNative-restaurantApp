import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCart } from "@/context/CartContext";

export default function CategoryItem({ item }: any) {
  const { addToCart } = useCart();
  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>

      <Text numberOfLines={2} style={styles.desc}>
        {item.description}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>R{item.price}</Text>

        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
          <AntDesign name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },

  name: {
    fontWeight: "700",
    fontSize: 14,
  },

  desc: {
    fontSize: 12,
    color: "#666",
    marginVertical: 4,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  price: {
    fontWeight: "800",
    fontSize: 14,
  },

  addBtn: {
    backgroundColor: "#F9BF01",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
