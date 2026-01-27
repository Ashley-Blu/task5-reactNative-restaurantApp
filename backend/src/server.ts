import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import menuRoutes from "./routes/menu.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Backend running successfully");
});

app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
