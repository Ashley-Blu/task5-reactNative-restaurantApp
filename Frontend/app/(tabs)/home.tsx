import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { pickedForYou, specials, menu } from "../../data/menu";

import PickedCard from "../../components/PickedCard";
import SpecialCard from "../../components/SpecialCard";
import CategoryItem from "../../components/CategoryItem";
import MenuItemCard from "../../components/MenuItemCard";

export default function Home() {
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ================= BANNER ================= */}
        <Image
          source={require("../../assets/images/banner.png")}
          style={styles.banner}
        />

        {/* ================= RESTAURANT INFO ================= */}
        <View style={styles.infoBox}>
          <Text style={styles.title}>Foodie’s Pizza Hut</Text>

          <Text style={styles.rating}>
            4.5 <AntDesign name="star" size={14} /> (4,000+) · R12 Delivery Fee
          </Text>

          <Text style={styles.address}>
            <EvilIcons name="location" size={18} />
            15 Biccard Street, Polokwane, 0700
          </Text>

          {/* DELIVERY / PICKUP */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === "delivery" && styles.active]}
              onPress={() => setMode("delivery")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "delivery" && styles.activeText,
                ]}
              >
                Delivery
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleBtn, mode === "pickup" && styles.active]}
              onPress={() => setMode("pickup")}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === "pickup" && styles.activeText,
                ]}
              >
                Pick-up
              </Text>
            </TouchableOpacity>

            <Text style={styles.time}>20 min{"\n"}Preparation</Text>
          </View>
        </View>

        {/* ================= PICKED FOR YOU ================= */}
        <Text style={styles.sectionTitle}>Picked for you</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {pickedForYou.map((item) => (
            <PickedCard key={item.id} item={item} />
          ))}
        </ScrollView>

        {/* ================= SPECIALS ================= */}
        <Text style={styles.sectionTitle}>Specials</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        >
          {specials.map((item) => (
            <SpecialCard key={item.id} item={item} onAdd={() => {}} />
          ))}
        </ScrollView>

        {/* ================= FULL MENU ================= */}
        {menu.map((section) => (
          <View key={section.id} style={styles.menuSection}>
            <Text style={styles.menuTitle}>{section.title}</Text>

            {/* GRID (pizza, salads, dessert) */}
            {section.type === "grid" && (
              <View style={styles.grid}>
                {section.items.map((item) => (
                  <CategoryItem key={item.id} item={item} />
                ))}
              </View>
            )}

            {/* LIST (drinks) */}
            {section.type === "list" && (
              <View>
                {section.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  banner: {
    width: "100%",
    height: 220,
  },

  infoBox: {
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  rating: {
    marginVertical: 4,
    fontSize: 13,
    color: "#444",
  },

  address: {
    fontSize: 13,
    color: "#444",
    marginBottom: 12,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  toggleBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },

  active: {
    backgroundColor: "#F9BF01",
    borderColor: "#F9BF01",
  },

  toggleText: {
    fontWeight: "600",
  },

  activeText: {
    fontWeight: "800",
  },

  time: {
    marginLeft: "auto",
    fontSize: 12,
    textAlign: "right",
    color: "#444",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 14,
    paddingHorizontal: 16,
  },

  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  menuTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
