import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { pickedForYou, specials, menu as staticMenu } from "../data/menu";
import { useCart } from "../context/CartContext";

type ItemParams = {
  id?: string;
  name?: string;
  description?: string;
  price?: string;
  imageUri?: string;
};

const findStaticItemById = (id: string | undefined) => {
  if (!id) return null;
  const all = [
    ...pickedForYou,
    ...specials,
    ...staticMenu.flatMap((section) => section.items),
  ];
  return all.find((it) => it.id === id) ?? null;
};

export default function ItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<ItemParams>();
  const { addToCart } = useCart();

  const baseItem = useMemo(() => {
    const priceNumber = params.price ? Number(params.price) : undefined;

    if (params.imageUri) {
      return {
        id: params.id ?? "",
        name: params.name ?? "",
        description: params.description ?? "",
        price: priceNumber ?? 0,
        image: { uri: params.imageUri },
      };
    }

    const staticMatch = findStaticItemById(params.id);
    if (staticMatch) {
      return staticMatch;
    }

    return {
      id: params.id ?? "",
      name: params.name ?? "",
      description: params.description ?? "",
      price: priceNumber ?? 0,
      image: undefined as any,
    };
  }, [params]);

  const [side, setSide] = useState<"chips" | "salad" | "pap">("chips");
  const [drink, setDrink] = useState<"none" | "can" | "bottle">("none");
  const [extras, setExtras] = useState<string[]>([]);
  const [noLettuce, setNoLettuce] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const extrasPrice = useMemo(() => {
    let total = 0;
    if (extras.includes("cheese")) total += 8;
    if (extras.includes("sauce")) total += 5;
    if (extras.includes("salad")) total += 12;
    return total;
  }, [extras]);

  const drinkPrice = useMemo(() => {
    if (drink === "can") return 10;
    if (drink === "bottle") return 15;
    return 0;
  }, [drink]);

  const perItemTotal = baseItem.price + extrasPrice + drinkPrice;
  const lineTotal = perItemTotal * quantity;

  const toggleExtra = (key: string) => {
    setExtras((prev) =>
      prev.includes(key) ? prev.filter((e) => e !== key) : [...prev, key],
    );
  };

  const handleAddToCart = () => {
    const summaryParts: string[] = [];
    summaryParts.push(`Side: ${side}`);
    if (drink !== "none") {
      summaryParts.push(
        `Drink: ${drink === "can" ? "Can drink" : "500ml bottle"}`,
      );
    }
    if (extras.length > 0) {
      summaryParts.push(
        `Extras: ${extras
          .map((e) =>
            e === "cheese" ? "Extra cheese" : e === "sauce" ? "Extra sauce" : "Side salad",
          )
          .join(", ")}`,
      );
    }
    if (noLettuce) summaryParts.push("No lettuce");

    const displayName =
      summaryParts.length > 0
        ? `${baseItem.name} (${summaryParts.join(" · ")})`
        : baseItem.name;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: String(baseItem.id),
        name: displayName,
        price: perItemTotal,
        image: baseItem.image,
      });
    }

    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {baseItem.image && (
          <Image source={baseItem.image} style={styles.image} />
        )}

        <Text style={styles.name}>{baseItem.name}</Text>
        <Text style={styles.description}>{baseItem.description}</Text>
        <Text style={styles.price}>R{baseItem.price.toFixed(2)}</Text>

        {/* Side options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a side (included)</Text>
          <View style={styles.chipRow}>
            {[
              { key: "chips", label: "Chips" },
              { key: "salad", label: "Salad" },
              { key: "pap", label: "Pap" },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[
                  styles.chip,
                  side === opt.key && styles.chipActive,
                ]}
                onPress={() => setSide(opt.key as any)}
              >
                <Text
                  style={[
                    styles.chipText,
                    side === opt.key && styles.chipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Drink options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drink</Text>
          <View style={styles.chipRow}>
            <TouchableOpacity
              style={[styles.chip, drink === "none" && styles.chipActive]}
              onPress={() => setDrink("none")}
            >
              <Text
                style={[
                  styles.chipText,
                  drink === "none" && styles.chipTextActive,
                ]}
              >
                No drink
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, drink === "can" && styles.chipActive]}
              onPress={() => setDrink("can")}
            >
              <Text
                style={[
                  styles.chipText,
                  drink === "can" && styles.chipTextActive,
                ]}
              >
                330ml can (+R10)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, drink === "bottle" && styles.chipActive]}
              onPress={() => setDrink("bottle")}
            >
              <Text
                style={[
                  styles.chipText,
                  drink === "bottle" && styles.chipTextActive,
                ]}
              >
                500ml bottle (+R15)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extras</Text>
          {[
            { key: "cheese", label: "Extra cheese (+R8)" },
            { key: "sauce", label: "Extra sauce (+R5)" },
            { key: "salad", label: "Side salad (+R12)" },
          ].map((opt) => {
            const active = extras.includes(opt.key);
            return (
              <TouchableOpacity
                key={opt.key}
                style={styles.row}
                onPress={() => toggleExtra(opt.key)}
              >
                <View
                  style={[
                    styles.checkbox,
                    active && styles.checkboxActive,
                  ]}
                />
                <Text style={styles.rowLabel}>{opt.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => setNoLettuce((v) => !v)}
          >
            <View
              style={[
                styles.checkbox,
                noLettuce && styles.checkboxActive,
              ]}
            />
            <Text style={styles.rowLabel}>No lettuce</Text>
          </TouchableOpacity>
        </View>

        {/* Quantity + total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => q + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>R{lineTotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.primaryText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  backBtn: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 14,
    color: "#555",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 18,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#F9BF01",
    borderColor: "#F9BF01",
  },
  chipText: {
    fontSize: 13,
    color: "#333",
  },
  chipTextActive: {
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#F9BF01",
    borderColor: "#F9BF01",
  },
  rowLabel: {
    fontSize: 14,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
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
  qtyValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
  },
  totalBox: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "800",
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#F9BF01",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
});

