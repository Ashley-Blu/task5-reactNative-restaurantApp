import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "@/context/CartContext";

type Props = {
  item: {
    id: string;
    name: string;
    price: number;
    image: any;
  };
};

export default function MenuItemCard({ item }: Props) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R{item.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() =>
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
          })
        }
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#fafafa",
    borderRadius: 14,
    padding: 12,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  price: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },

  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F9BF01",
    alignItems: "center",
    justifyContent: "center",
  },

  plus: {
    fontSize: 20,
    fontWeight: "800",
  },
});
