// =======================
// PICKED FOR YOU
// =======================
export const pickedForYou = [
  {
    id: "f1",
    name: "Rustic Artisan Pizza",
    description: "Cheesy crust with freshly cut roman tomatoes and herbs",
    price: 186,
    image: require("../assets/images/f1.png"),
  },
  {
    id: "f2",
    name: "Rainbow Veggie Salad",
    description: "Fresh greens topped with grilled tofu and avocado",
    price: 120,
    image: require("../assets/images/f2.png"),
  },
  {
    id: "f3",
    name: "Creamy-filled Pastry",
    description: "Flaky pastry filled with rich cream and powdered sugar",
    price: 150,
    image: require("../assets/images/f3.png"),
  },
  {
    id: "f4",
    name: "Banana Pizza",
    description: "Sweet banana slices on baked pizza crust drizzled with honey",
    price: 200,
    image: require("../assets/images/f4.png"),
  },
];


// =======================
// SPECIALS
// =======================
export const specials = [
  {
    id: "sp1",
    name: "Large Mexican Pizza + 1.5L Pepsi",
    description: "Mexican pizza with olives, avocado and peppers",
    price: 200,
    image: require("../assets/images/sp1.jpeg"),
  },
  {
    id: "sp2",
    name: "2 Pepperoni Pizzas + 2L Pepsi",
    description: "Spicy pepperoni with mushrooms",
    price: 300,
    image: require("../assets/images/sp2.webp"),
  },
  {
    id: "sp3",
    name: "Large Meaty Pizza + 2×500ml Pepsi",
    description: "Pepperoni, bacon and red onions",
    price: 170,
    image: require("../assets/images/sp3.webp"),
  },
  {
    id: "sp4",
    name: "2 Golden Spiral Pastries",
    description: "Golden flaky pastries baked to perfection",
    price: 100,
    image: require("../assets/images/sp4.png"),
  },
];


// =======================
// CATEGORIES (TOP SCROLL)
// =======================
export const categories = [
  { id: "pizza", title: "Pizza" },
  { id: "salads", title: "Salads" },
  { id: "dessert", title: "Dessert" },
  { id: "drinks", title: "Drinks" },
];


// =======================
// FULL MENU
// =======================
export const menu = [
  {
    id: "pizza",
    title: "Pizza",
    type: "grid",
    items: [
      {
        id: "p1",
        name: "Bacon & Onion Pizza",
        description:
          "Large bacon and red onion pizza with pepperoni and BBQ sauce",
        price: 159,
        image: require("../assets/images/p1.webp"),
      },
      {
        id: "p2",
        name: "Pepperoni & Red Onion Pizza",
        description: "Large pepperoni pizza with gouda cheese",
        price: 169,
        image: require("../assets/images/p2.jpg"),
      },
      {
        id: "p3",
        name: "Peppers & Olives Pizza",
        description: "Mixed peppers and olives with cheddar cheese",
        price: 179,
        image: require("../assets/images/p3.png"),
      },
      {
        id: "p4",
        name: "Classic Pepperoni Pizza",
        description: "Large pepperoni pizza with cheddar cheese",
        price: 150,
        image: require("../assets/images/p4.png"),
      },
      {
        id: "p5",
        name: "Bacon & Avocado Pizza",
        description: "Bacon and avocado with gouda and mozzarella",
        price: 160,
        image: require("../assets/images/p5.png"),
      },
      {
        id: "p6",
        name: "Meaty Creamy Pizza",
        description: "Pepperoni, peppers, mushrooms and herbs",
        price: 180,
        image: require("../assets/images/p6.png"),
      },
    ],
  },

  {
    id: "salads",
    title: "Salads",
    type: "grid",
    items: [
      {
        id: "s1",
        name: "Grilled Tofu & Veggie Salad",
        description: "Grilled tofu with avocado, peppers and basil",
        price: 120,
        image: require("../assets/images/s1.png"),
      },
      {
        id: "s2",
        name: "Chicken Stir-fry Salad",
        description: "Stir-fried chicken with vegetables and herbs",
        price: 120,
        image: require("../assets/images/s2.png"),
      },
    ],
  },

  {
    id: "dessert",
    title: "Dessert",
    type: "grid",
    items: [
      {
        id: "d1",
        name: "Elegant Spiral Pastry",
        description: "Golden flaky pastry baked to perfection",
        price: 59,
        image: require("../assets/images/d1.png"),
      },
      {
        id: "d2",
        name: "Baked Viennoiserie",
        description: "Layered pastry with powdered sugar",
        price: 79,
        image: require("../assets/images/d2.png"),
      },
    ],
  },

  {
    id: "drinks",
    title: "Drinks",
    type: "list",
    items: [
      {
        id: "dr1",
        name: "Pepsi 500ml",
        description: "500ml chilled carbonated soft drink",
        price: 15.9,
        image: require("../assets/images/500ml_pespsi.png"),
      },
      {
        id: "dr2",
        name: "Pepsi 1.5L",
        description: "1.5L chilled carbonated soft drink",
        price: 21.9,
        image: require("../assets/images/1.5l_pepsi.png"),
      },
      {
        id: "dr3",
        name: "Pepsi 2L",
        description: "2L chilled carbonated soft drink",
        price: 29.9,
        image: require("../assets/images/2l_pepsi.png"),
      },
      {
        id: "dr4",
        name: "Water",
        description: "500ml bottled water",
        price: 12.9,
        image: require("../assets/images/water.png"),
      },
    ],
  },
];
