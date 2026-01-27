import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";

type Props = {
  item: {
    name: string;
    description: string;
    price: number;
    image: any;
  };
  onAdd: () => void;
};

export default function SpecialCard({ item, onAdd }: Props) {
  const { addToCart } = useCart();
  return (
    <View style={styles.card}>
      {/* LEFT */}
      <View style={styles.left}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>R{item.price}</Text>

        <Text style={styles.desc}>{item.description}</Text>

        <View style={styles.likeRow}>
          <Ionicons name="thumbs-up" size={14} />
          <Text style={styles.percent}>100%</Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        <Image source={item.image} style={styles.image} />

        <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
          <Ionicons name="add" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFD84D",
    borderRadius: 18,
    padding: 12,
    width: 300,
    marginRight: 14,
    flexDirection: "row",
  },

  left: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontWeight: "800",
    fontSize: 14,
  },

  price: {
    fontWeight: "800",
    marginVertical: 4,
  },

  desc: {
    fontSize: 12,
    color: "#333",
  },

  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  percent: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  right: {
    position: "relative",
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },

  addBtn: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
