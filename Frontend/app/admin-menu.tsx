import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import api from "../api/api";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
};

export default function AdminMenu() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !category) {
      Alert.alert("Validation", "Name, price, and category are required.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/admin/menu", {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
      });
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategory("");
      fetchMenu();
      Alert.alert("Success", "Menu item added!");
    } catch (err) {
      Alert.alert("Error", "Failed to add menu item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Menu Dashboard</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <Button
        title={loading ? "Adding..." : "Add Menu Item"}
        onPress={handleAdd}
        disabled={loading}
      />
      <Text style={styles.sectionTitle}>Current Menu</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <Text style={styles.menuName}>
              {item.name} ({item.category})
            </Text>
            <Text>R{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  error: { color: "red", marginBottom: 8 },
  menuItem: { padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  menuName: { fontWeight: "bold" },
});
