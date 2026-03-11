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
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [special, setSpecial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/menu");
      setMenu(res.data);
      setError("");
    } catch {
      setError("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name || !price || !categoryId) {
      Alert.alert(
        "Validation",
        "Name, price, and category ID are required."
      );
      return;
    }

    const numericCategoryId = Number(categoryId);
    if (Number.isNaN(numericCategoryId)) {
      Alert.alert("Validation", "Category ID must be a number.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/menu", {
        name,
        description,
        price: parseFloat(price),
        image,
        category_id: numericCategoryId,
        featured,
        special,
      });
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setCategoryId("");
      setFeatured(false);
      setSpecial(false);
      await fetchMenu();
      Alert.alert("Success", "Menu item added!");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to add menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    Alert.alert("Delete", "Are you sure you want to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await api.delete(`/menu/${id}`);
            await fetchMenu();
          } catch (err: any) {
            Alert.alert(
              "Error",
              err?.response?.data?.message || "Failed to delete item"
            );
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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
        placeholder="Category ID (number)"
        value={categoryId}
        onChangeText={setCategoryId}
        keyboardType="numeric"
        style={styles.input}
      />
      <View style={styles.toggleRow}>
        <Button
          title={featured ? "Featured ✓" : "Mark as featured"}
          onPress={() => setFeatured((v) => !v)}
        />
      </View>
      <View style={styles.toggleRow}>
        <Button
          title={special ? "Special ✓" : "Mark as special"}
          onPress={() => setSpecial((v) => !v)}
        />
      </View>
      <Button
        title={loading ? "Saving..." : "Add Menu Item"}
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
            <View style={{ flex: 1 }}>
              <Text style={styles.menuName}>
                {item.name} ({item.category})
              </Text>
              <Text>R{item.price}</Text>
            </View>
            <Button
              title="Delete"
              color="#d32f2f"
              onPress={() => handleDelete(item.id)}
            />
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
  toggleRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  error: { color: "red", marginBottom: 8 },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuName: { fontWeight: "bold" },
});
