import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";

type Props = {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: any;
  };
};

export default function PickedCard({ item }: Props) {
  const { addToCart } = useCart();

  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Image source={item.image} style={styles.image} />

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

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>R{item.price}</Text>
      <Text style={styles.more}>view more… ⓘ</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 14,
  },

  imageBox: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 14,
  },

  addBtn: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  plus: {
    fontSize: 18,
    fontWeight: "800",
  },

  name: {
    marginTop: 6,
    fontWeight: "700",
    fontSize: 14,
  },

  price: {
    fontWeight: "700",
    marginTop: 2,
  },

  more: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
});
